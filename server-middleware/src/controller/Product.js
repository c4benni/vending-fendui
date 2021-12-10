/* eslint-disable camelcase */
const { app } = require('../config/config')
const { Product, User } = require('../models')
const attempt = require('../utils/attempt')
const { signUserFromCookie } = require('../utils/sessions')

async function deleteProductLogic({ req, res, productID, sendMessage }) {
  const mainCallback = async () => {
    // check that user is signed in;
    const { id: userId } = req.cookies

    if (!userId) {
      return (
        sendMessage &&
        res.status(401).send({
          error: {
            message: 'session expired'
          }
        })
        // unauthorized
      )
    }

    // check that product exists;
    const product = await Product.findOne({
      where: { id: productID }
    })

    if (!product) {
      return (
        sendMessage &&
        res.status(404).send({
          error: {
            message: 'item not found or might have been deleted',
            status: 404
          }
        })
        // not found
      )
    }

    // check that product.sellerId == userId;
    if (product.sellerId !== userId) {
      return (
        sendMessage &&
        res.status(401).send({
          error: {
            message: 'only the owner of this product can delete it',
            status: 401
          }
        })
        // unauthorized
      )
    }

    // all checked, can delete;
    await product.destroy()

    return sendMessage
      ? res.status(204).send({
          data: {
            message: 'product successfully deleted'
          }
          // no content
        })
      : true
  }

  await attempt({
    express: { res },
    callback: mainCallback
  })
}

module.exports = {
  async createProduct(req, res) {
    const mainCallback = async () => {
      // only logged in users with role == 'seller' can access this route.
      const { id } = req.cookies

      if (!id) {
        return res.status(401).send({
          error: {
            message: 'you need to login first',
            status: 401
          }
        })
        // unauthorized
      }

      const user = await User.findOne({
        where: { id }
      })

      if (!user) {
        return res.status(404).send({
          error: {
            message: 'this account may have been deleted',
            status: 404
          }
        })
        // not found
      }

      if (user.role != 'seller') {
        return res.status(401).send({
          error: {
            message:
              'only a seller can add a product. Create a seller account?',
            status: 401
          }
        })
        // unauthorized
      }

      // check if product name exist;
      const findProduct = await Product.findOne({
        where: { productName: req.body.productName },
        attributes: ['id'],
        raw: true
      })

      if (findProduct) {
        return res.status(403).send({
          error: {
            message: 'product exists. Choose another name.',
            status: 403
          }
        })
        // forbidden
      }

      // create a new product;
      const product = await Product.create({
        ...req.body,
        sellerId: id,
        background: app.productImages
      })

      const productJSON = product.toJSON()

      delete productJSON.createdAt

      // send success if okay;
      res.send({
        data: {
          message: 'product successfully created!',
          product: productJSON
        }
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async readProduct(req, res) {
    const mainCallback = async () => {
      // anyone can view this
      const { id } = req.query

      // still renew signed in users.
      await signUserFromCookie(req, res)

      const product = await Product.findOne({
        where: { id }
      })

      if (!product) {
        return res.status(404).send({
          error: {
            message: 'product not found or might have been deleted',
            status: 404
          }
        })
        // not found
      }

      // send filtered result;
      const disAllowedFields = ['id', 'updatedAt']

      const productJSON = product.toJSON()

      const sellerUser = await User.findOne({
        where: {
          id: productJSON.sellerId
        },
        attributes: ['username'],
        raw: true
      })

      const sellerInfo = {}

      if (sellerUser) {
        sellerInfo.username = sellerUser.username
      } else {
        sellerInfo.error = {
          message: 'this user has been deleted'
        }
      }

      const data = {
        ...productJSON,
        sellerInfo
      }

      disAllowedFields.forEach((field) => {
        delete data[field]
      })

      return res.send({
        data
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async readAllProducts(req, res) {
    const mainCallback = async () => {
      const { limit, where = '{}', offset } = req.query

      const getWhere = typeof where == 'object' ? JSON.stringify(where) : where

      const findProducts = await Product.findAll({
        where: JSON.parse(getWhere),
        limit,
        offset,
        raw: true
      })

      if (!findProducts.length) {
        return res.status(404).send({
          error: {
            message: 'no product(s) found',
            status: 404
          }
        })
        // not found
      } else {
        await signUserFromCookie(req, res)

        res.send({
          data: findProducts.map((x) => {
            const {
              id,
              sellerId,
              productName,
              cost,
              amountAvailable,
              type,
              background,
              rating,
              caption,
              ownerDeleted
            } = x

            return {
              id,
              sellerId,
              productName,
              cost,
              amountAvailable,
              type,
              background,
              rating,
              caption,
              ownerDeleted
            }
          }),
          length: findProducts.length
        })
      }
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  // only the user that posted this product can update it;
  async patchProduct(req, res) {
    const mainCallback = async () => {
      // check that user is signed in;
      const { id: userId } = req.cookies

      if (!userId) {
        return res.status(401).send({
          error: {
            message: 'session expired',
            status: 401
          }
        })
        // unauthorized
      }

      const { id: productID } = req.body

      // check that product exists;
      const product = await Product.findOne({
        where: { id: productID }
      })

      if (!product) {
        return res.status(404).send({
          error: {
            message: 'item not found or might have been deleted',
            status: 404
          }
        })
        // not found
      }

      // check that product.sellerId == userId;
      if (product.sellerId !== userId) {
        return res.status(401).send({
          error: {
            message: 'only the owner of this product can update it',
            status: 401
          }
        })
        // unauthorized
      }

      // ensure new productName doesn't exist;
      if (req.body.productName) {
        const existingProductName = await Product.findOne({
          where: { productName: req.body.productName },
          attributes: ['productName']
        })

        if (existingProductName) {
          return res.status(403).send({
            error: {
              message: 'product name is taken. Choose another name',
              status: 403
            }
          })
          // forbidden
        }
      }

      // all checked, can update roles in body,
      // since the policy validates them.
      await product.update(req.body)

      await product.save()

      res.send({
        data: product.toJSON()
      })
    }

    await attempt({
      express: { res },
      callback: mainCallback
    })
  },

  async deleteProduct(req, res) {
    await deleteProductLogic({
      req,
      res,
      productID: req.query.id,
      sendMessage: true
    })
  },

  async deleteMultipleProducts(req, res) {
    const { ids } = req.body

    let errorCaught = false

    for (const id of ids) {
      const deleteItem = await deleteProductLogic({
        req,
        res,
        productID: id,
        sendMessage: false
      })

      if (deleteItem === false) {
        errorCaught = true
        break
      }
    }

    errorCaught
      ? res.status(500).send({
          error: {
            message: 'an error occured',
            status: 500
          }
        })
      : res.status(204).send({
          data: {
            message: 'item(s) deleted',
            status: 204
          }
        })
    // no content
  }
}

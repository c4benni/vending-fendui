(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{535:function(e,t,r){var content=r(543);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(40).default)("7250b97e",content,!0,{sourceMap:!1})},536:function(e,t,r){var content=r(549);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(40).default)("62bf902c",content,!0,{sourceMap:!1})},542:function(e,t,r){"use strict";r(535)},543:function(e,t,r){var o=r(39)((function(i){return i[1]}));o.push([e.i,".root:not(:hover)::-webkit-scrollbar-thumb{background-color:transparent}",""]),o.locals={},e.exports=o},544:function(e,t,r){"use strict";var o=r(5),n=r(7),c=r(26),l=r(41),d=r(49),h=r(27),f=r(10),m=r(305),v=r(201),x=r(545),y=r(546),k=r(109),w=r(547),_=[],C=n(_.sort),$=n(_.push),j=f((function(){_.sort(void 0)})),D=f((function(){_.sort(null)})),O=v("sort"),P=!f((function(){if(k)return k<70;if(!(x&&x>3)){if(y)return!0;if(w)return w<603;var code,e,t,r,o="";for(code=65;code<76;code++){switch(e=String.fromCharCode(code),code){case 66:case 69:case 70:case 72:t=3;break;case 68:case 71:t=4;break;default:t=2}for(r=0;r<47;r++)_.push({k:e+r,v:t})}for(_.sort((function(a,b){return b.v-a.v})),r=0;r<_.length;r++)e=_[r].k.charAt(0),o.charAt(o.length-1)!==e&&(o+=e);return"DGBEFHACIJK"!==o}}));o({target:"Array",proto:!0,forced:j||!D||!O||!P},{sort:function(e){void 0!==e&&c(e);var t=l(this);if(P)return void 0===e?C(t):C(t,e);var r,o,n=[],f=d(t);for(o=0;o<f;o++)o in t&&$(n,t[o]);for(m(n,function(e){return function(t,r){return void 0===r?-1:void 0===t?1:void 0!==e?+e(t,r)||0:h(t)>h(r)?1:-1}}(e)),r=n.length,o=0;o<r;)t[o]=n[o++];for(;o<f;)delete t[o++];return t}})},545:function(e,t,r){var o=r(89).match(/firefox\/(\d+)/i);e.exports=!!o&&+o[1]},546:function(e,t,r){var o=r(89);e.exports=/MSIE|Trident/.test(o)},547:function(e,t,r){var o=r(89).match(/AppleWebKit\/(\d+)\./);e.exports=!!o&&+o[1]},548:function(e,t,r){"use strict";r(536)},549:function(e,t,r){var o=r(39)((function(i){return i[1]}));o.push([e.i,".input[type=search]::-webkit-search-cancel-button,.input[type=search]::-webkit-search-decoration,.input[type=search]::-webkit-search-results-button,.input[type=search]::-webkit-search-results-decoration{-webkit-appearance:none}.input::-ms-clear,.input::-ms-reveal{display:none}",""]),o.locals={},e.exports=o},565:function(e,t,r){"use strict";r.r(t);var o=r(0),n=(r(24),r(19),r(303),r(18),r(8),r(147),r(47),r(13),r(110),r(144),r(143),r(75),r(146)),c=r(36),l=(r(46),r(197)),d=r(200),main=r(3),h=(r(21),r(14),r(22),r(23),r(6)),f=r(50),m=r(54);function v(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function x(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(t){Object(h.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var y=function(){function e(t){var r,o,n,l,d=this,h=t.root,m=t.children,v=t.loop,y=void 0===v||v,k=t.preventScroll,w=void 0!==k&&k,_=t.closest,C=t.uid;(Object(f.a)(this,e),this.uid=C,e.savedRoots=x({},e.savedRoots||{}),e.savedRoots.items=x({},e.savedRoots.items||{}),e.timeStamp=e.timeStamp||Date.now(),e.savedRoots.items[C]=Object(c.a)(e.savedRoots.items[C]||[]),e.savedRoots.items[C].length)?this.$children=e.savedRoots.items[C]:(this.root=h,this.$children=null===(n=this.root)||void 0===n||null===(l=n.querySelectorAll)||void 0===l?void 0:l.call(n,"".concat(m)));this.root=0,this.loop=y,this.preventScroll=w,this.closest=_||m,this.focusableNodes=this.$children&&Object(c.a)(this.$children).filter((function(e){return!!(Object(main.j)(e)&&e.tabIndex>-1&&e.getAttribute("tabindex")>-1&&!e.getAttribute("disabled"))&&(d.closest?e.closest(d.closest):e)})),null!==(r=e.savedRoots.items[C])&&void 0!==r&&r.length||(e.savedRoots.items[C]=this.focusableNodes),this.$children=0,this.index=(null===(o=this.focusableNodes)||void 0===o?void 0:o.length)&&this.focusableNodes.indexOf(this.focusableNodes.find((function(e){return e.isSameNode(e.ownerDocument.activeElement)})))}return Object(m.a)(e,[{key:"forward",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;if(this.focusableNodes.length){var t=this.index+1+e>this.focusableNodes.length-1?this.loop?0:this.focusableNodes.length-1:this.index+1+e;this.focusableNodes[t].focus({preventScroll:this.preventScroll}),this.destroy()}}},{key:"backward",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;if(this.focusableNodes.length){var t=this.index-1-e<0?this.loop?this.focusableNodes.length-1:0:this.index-1-e;this.focusableNodes[t].focus({preventScroll:this.preventScroll}),this.destroy()}}},{key:"destroy",value:function(){this.$children=0,this.root=0,this.focusableNodes=0}},{key:"clear",value:function(){e.savedRoots={}}}]),e}(),k={components:{appImg:l.default,UiBtn:d.default},props:{miniDevice:Boolean,mobileNav:Boolean,closeNav:{type:Function,default:function(){}}},data:function(){return{ordersState:!1}},computed:{media:function(){return this.$store.state.media},isMiniDevice:function(){return this.miniDevice},userImage:function(){return this.user.image||"/samples/people/boy-snow-hoodie"},generalLinks:function(){var e=this.$route,t=function(path){return new RegExp("^/dashboard/".concat(path,"/?")).test(e.path)},r=function(path){return"/dashboard/".concat(path)};return[{title:"Overview",isActive:/^\/dashboard\/?$/.test(e.path),icon:"home",to:"".concat(r(""))},{title:"Analytics",isActive:t("analytics"),icon:"pieChart",to:"".concat(r("analytics"))},this.isBuyer&&{title:"Shop",isActive:t("shop"),icon:"basket",to:"".concat(r("shop"))},{title:"Finance",isActive:t("finance"),icon:"finance",to:"".concat(r("finance"))},{title:"Account",isActive:t("account"),icon:"accountCircle",to:"".concat(r("account"))}].filter(Boolean)},managementLinks:function(){var e=this.$route,t=function(path){return new RegExp("^/dashboard/".concat(path,"/?")).test(e.path)},r=function(path){return"/dashboard/".concat(path)},o=[{title:"Deposit coins",isActive:t("deposit"),icon:"deposit",to:"".concat(r("deposit"))},{title:"Reset deposit",isActive:t("reset-deposit"),icon:"timelineClock",to:"".concat(r("reset-deposit"))}],n=[{title:"Create a product",isActive:t("create-product"),icon:"deposit",to:"".concat(r("create-product"))},{title:"My products",isActive:t("my-products"),icon:"fileChart",to:"".concat(r("my-products"))}];return{collapse:[{title:"Orders",isActive:this.ordersState,icon:"storeCog",collapse:!0,children:[{title:"List",isActive:t("orders/list"),to:"".concat(r("orders/list"))},{title:"Details",isActive:t("orders/details"),to:"".concat(r("orders/details"))},{title:"Clear orders",isActive:t("orders/clear-orders"),to:"".concat(r("orders/clear-orders"))}]}],generic:[{title:"Transactions",isActive:t("transactions"),icon:"history",to:"".concat(r("transactions"))}].concat(Object(c.a)("buyer"==this.user.role?o:n))}},user:function(){return this.$store.state.user||{}},isBuyer:function(){return"buyer"==this.user.role}},watch:{mobileNav:function(e){var t=this;return Object(o.a)(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(!e||!t.miniDevice){r.next=8;break}return r.next=3,t.$sleep(50);case 3:document.documentElement.classList.add("overlay-active"),t.$refs.scroll.scrollTo(0,0),t.$refs.root.focus(),r.next=9;break;case 8:document.documentElement.classList.remove("overlay-active");case 9:case"end":return r.stop()}}),r)})))()}},methods:{logout:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.$dispatch("logout");case 2:requestAnimationFrame((function(){e.$router.replace("/?login=true")}));case 3:case"end":return t.stop()}}),t)})))()},hackFocus:function(e){var t=this;if(this.miniDevice&&this.mobileNav){if("esc"==Object(main.e)(e))return e.preventDefault();Object(main.i)(e,(function(r,o){var n=new y({root:e.currentTarget,children:"*",uid:t._uid});n[e.shiftKey?"backward":"forward"](),n.destroy(),n=0}))}},closeOnEsc:function(e){if("esc"==Object(main.e)(e))return this.closeNav()}}},w=(r(542),r(17)),component=Object(w.a)(k,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("nav",{ref:"root",staticClass:"root fill-before before:border-r-[1px] before:border-black dark:before:border-white before:opacity-[.1] h-full fixed left-0 dark:bg-blue-gray-900 lg:dark:bg-opacity-40 bg-white outline-none",class:e.isMiniDevice?["transition-transform transform-gpu left-0 pb-[64px] top-0 z-20",{"translate-x-[-100%]":!e.mobileNav,"translate-x-0":e.mobileNav}]:[],attrs:{tabindex:e.isMiniDevice&&e.mobileNav?"0":void 0},on:{keydown:e.hackFocus,keyup:e.closeOnEsc}},[r("div",{ref:"scroll",staticClass:"w-[280px] pb-[64px] overscroll-contain max-h-[100vh] overflow-y-auto hide-scrollbar"},[r("div",{staticClass:"h-[96px] w-100 flex items-center justify-start px-4"},[r("app-img",{attrs:{"public-id":e.media.favIco,height:"38px",width:"38px"}}),e._v(" "),r("p",{staticClass:"ml-1 cursive-text"},[e._v("Vending app")])],1),e._v(" "),r("ui-btn",{staticClass:"rounded-md h-[72px] w-[calc(100%-3rem)] bg-blue-gray-100 dark:bg-blue-gray-800 mx-auto grid grid-flow-col grid-cols-[60px,1fr] py-2 px-4 items-center cursor-pointer hover:bg-blue-gray-200 dark:hover:bg-blue-gray-800 justify-start text-left",attrs:{title:e.user.role+" account",to:"/dashboard/account",outlined:"","outlined-opacity":.05,"outlined-stroke":"0.5px"}},[r("div",{staticClass:"h-[48px] w-[48px] rounded-full bg-blue-gray-400 overflow-hidden mr-[10%]"},[r("app-img",{staticClass:"object-cover",attrs:{"public-id":e.userImage,height:"48px",width:"48px",radius:"max","fetch-format":"auto",quality:"100"}})],1),e._v(" "),r("div",{staticClass:"overflow-hidden"},[r("h2",{staticClass:"dark:text-white text-black font-semibold text-[0.9rem] capitalize truncate"},[e._v(e._s(e.user.displayName||e.user.username))]),e._v(" "),r("h3",{staticClass:"dark:text-white text-black font-normal text-sm text-opacity-50 dark:text-opacity-50 truncate"},[e._v("@"+e._s(e.user.username))])])]),e._v(" "),r("div",{staticClass:"fill-before before:border-t before:border-black dark:before:border-white before:opacity-10 w-full h-[fit-content] relative mt-8"},[r("div",{staticClass:"grid"},[r("h4",{staticClass:"uppercase font-medium text-black dark:text-white text-opacity-50 dark:text-opacity-50 text-[0.75rem] mt-[32px] px-8 mb-2"},[e._v("General")]),e._v(" "),e._l(e.generalLinks,(function(t,i){return r("ui-btn",{key:i,staticClass:"h-[42px] w-10/12 mx-auto mb-1 justify-start gap-x-2 text-[0.9rem] rounded-sm bg-opacity-10 dark:bg-opacity-10 hover:before:bg-teal-500 dark:hover:before:bg-teal-300",class:{"bg-teal-500 dark:bg-teal-300 text-teal-800 dark:text-teal-400 opacity-100":t.isActive,"opacity-70":!t.isActive},attrs:{tag:"nuxt-link",to:t.to}},[r("ui-icon",{attrs:{name:t.icon,size:"20px"}}),e._v("\n                    "+e._s(t.title)+"\n                ")],1)}))],2),e._v(" "),r("div",{staticClass:"grid"},[r("h4",{staticClass:"uppercase font-medium text-black dark:text-white text-opacity-50 dark:text-opacity-50 text-[0.75rem] mt-[32px] px-8 mb-2"},[e._v("Management")]),e._v(" "),r("div",{staticClass:"mx-auto mb-1 w-10/12"},[e._l(e.managementLinks.collapse,(function(t,i){return r("ui-btn",{key:i,staticClass:"h-[42px] w-full justify-start gap-x-2 text-[0.9rem] rounded-sm bg-opacity-10 dark:bg-opacity-10 grid-cols-[auto,1fr,auto] justify-items-start hover:before:bg-teal-500 dark:hover:before:bg-teal-300",class:{"bg-teal-500 dark:bg-teal-300 text-teal-800 dark:text-teal-400 opacity-100":t.isActive,"opacity-70":!t.isActive},on:{click:function(t){e.ordersState=!e.ordersState}}},[r("ui-icon",{attrs:{name:t.icon,size:"20px"}}),e._v("\n                        "+e._s(t.title)+"\n                        "),r("ui-icon",{key:e.ordersState,attrs:{name:e.ordersState?"chevronUp":"chevronDown",size:"20px"}})],1)})),e._v(" "),r("div",{staticClass:"grid overflow-hidden justify-items-end",style:{height:e.ordersState?"135px":"0",transition:"0.15s ease-in-out height, 0.15s linear opacity",opacity:e.ordersState?"1":"0"}},e._l(e.managementLinks.collapse[0].children,(function(t,i){return r("ui-btn",{key:i,staticClass:"h-[42px] w-11/12 justify-start gap-x-2 text-[0.9rem] rounded-sm bg-opacity-10 dark:bg-opacity-10 hover:before:bg-teal-500 dark:hover:before:bg-teal-300 pl-6",class:{"bg-teal-500 dark:bg-teal-300 text-teal-800 dark:text-teal-400 opacity-100":t.isActive,"opacity-70":!t.isActive,"grid-cols-[auto,1fr,auto] justify-items-start":t.collapse,"mt-[8px]":0==i},attrs:{tag:"nuxt-link",to:t.to,disabled:!e.ordersState}},[e._v(e._s(t.title))])})),1)],2),e._v(" "),e._l(e.managementLinks.generic,(function(t,i){return r("ui-btn",{key:i,staticClass:"h-[42px] w-10/12 mx-auto mb-1 justify-start gap-x-2 text-[0.9rem] rounded-sm bg-opacity-10 dark:bg-opacity-10 hover:before:bg-teal-500 dark:hover:before:bg-teal-300",class:{"bg-teal-500 dark:bg-teal-300 text-teal-800 dark:text-teal-400 opacity-100":t.isActive,"opacity-70":!t.isActive,"grid-cols-[auto,1fr,auto] justify-items-start":t.collapse},attrs:{tag:"nuxt-link",to:t.to}},[r("ui-icon",{attrs:{name:t.icon,size:"20px"}}),e._v("\n                    "+e._s(t.title)+"\n                ")],1)}))],2),e._v(" "),r("div",{staticClass:"grid mt-[32px] relative fill-before before:border-t before:border-black dark:before:border-white before:opacity-10"},[r("ui-btn",{staticClass:"h-[42px] w-10/12 mx-auto mb-1 justify-start gap-x-2 text-[0.9rem] rounded-sm hover:before:bg-red-900 dark:hover:before:bg-red-700 mt-[32px] border border-red-600 dark:border-red-400 bg-red-700 dark:bg-red-600 bg-opacity-40 hover:text-white hover:bg-opacity-100 dark:bg-opacity-25",attrs:{tag:"nuxt-link"},nativeOn:{click:function(t){return e.logout.apply(null,arguments)}}},[r("ui-icon",{attrs:{name:"powerOff",size:"20px"}}),e._v("Logout\n                ")],1)],1)])],1),e._v(" "),e.isMiniDevice?r("ui-btn",{staticClass:"absolute mt-6 mr-3 mb-[64px] bg-red-700 dark:bg-red-600 bg-opacity-10 dark:bg-opacity-10 hover:bg-opacity-80 dark:hover:bg-opacity-60 top-0 right-0 z-[2] rounded-full w-[42px] h-[42px] p-0",attrs:{title:"close nav"},on:{click:e.closeNav}},[r("ui-icon",{attrs:{name:"windowClose"}})],1):e._e()],1)}),[],!1,null,null,null),_=component.exports,C=(r(544),r(48),r(198),{computed:{totalChangeAlert:function(){var e=this.changeTotal;return e?"You have a total of ".concat(this.formatCoin(e)," left"):"You have no change left."},changeTotal:function(){return parseFloat(this.processingDone.changeTotal)},purchasedChange:function(){var e=this.processingDone.change;if(!Array.isArray(e))return{};var output={};return e.forEach((function(e){if(!output[e])return output[e]=1;output[e]++})),Object.entries(output).map((function(e){var t=parseFloat(e[0]),r=e[1];return{key:t,value:"".concat(r," piece").concat(r>1?"s":"")}})).sort((function(a,b){var e=a.key,t=b.key;return e<t?1:e>t?-1:0}))},processingDone:function(){return this.$store.state.processingDone||{}},isPurchasedDialog:function(){return!!this.processingDone.change},isProcessing:function(){return this.$store.state.dashboardProcessing}},methods:{formatCoin:function(e){return Object(main.f)(e)}}}),$=Object(w.a)(C,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.isProcessing?r("div",{key:e.processingDone.key,staticClass:"absolute w-full h-full grid justify-center",class:{"items-start fade-appear":!e.isPurchasedDialog,"items-center anim-scale-enter-active":e.isPurchasedDialog}},[r("div",{staticClass:"bg-white dark:bg-blue-gray-900 grid overflow-hidden isolate relative",class:{"pt-4 rounded-b-sm grid-flow-col":!e.isPurchasedDialog,"p-6 rounded-md fill-before before-divide before:border min-w-[280px] sm:min-w-[320px] md:min-w-[350px]":e.isPurchasedDialog}},[r("div",{staticClass:"grid start-center justify-center pl-6",class:{"text-green-700":!!e.processingDone&&!e.processingDone.error,"text-red-700":!!e.processingDone&&e.processingDone.error,"mb-3":e.isPurchasedDialog,"mt-2":!e.isPurchasedDialog}},[e.processingDone?r("ui-icon",{attrs:{name:e.processingDone.error?"close":"check",size:e.isPurchasedDialog?"56px":void 0}}):r("div",{staticClass:"spinner-border"})],1),e._v(" "),r("div",{class:{"text-center mb-1":e.isPurchasedDialog}},[r("p",{staticClass:"px-6 font-bold text-xl"},[e._v("\n                "+e._s(e.processingDone.title)+"\n            ")]),e._v(" "),r("p",{staticClass:"px-6 mb-6 opacity-80 text-sm mt-1",class:{"pr-12":!!e.processingDone&&!e.isPurchasedDialog}},[e._v("\n                "+e._s(e.processingDone.subtitle)+"\n            ")])]),e._v(" "),e.isPurchasedDialog?r("div",{staticClass:"rounded-sm border-[1.5px] border-dashed border-blue-700 dark:border-blue-500 border-opacity-25 dark:border-opacity-25 mx-3 py-3",staticStyle:{"background-color":"var(--theme-background)"}},[e.changeTotal?r("p",{staticClass:"font-bold px-3"},[e._v("Your change")]):e._e(),e._v(" "),e.changeTotal?r("div",{staticClass:"my-3 px-4"},e._l(e.purchasedChange,(function(t,i){return r("div",{key:i,staticClass:"grid grid-flow-col grid-cols-[auto,1fr,auto] items-center gap-x-2 text-sm opacity-75 mb-1"},[r("p",[e._v("¢"+e._s(t.key))]),e._v(" "),r("span",{staticClass:"h-[1px] w-full border-t border-dotted dark:opacity-20"}),e._v(" "),r("p",{staticClass:"opacity-80"},[e._v(e._s(t.value))])])})),0):e._e(),e._v(" "),r("p",{staticClass:"text-[0.8rem] opacity-60",class:{"fill-before before-divide before:border-t relative before:opacity-20 dark:before:10 py-3 px-4 pb-0 ":e.changeTotal,"text-center":!e.changeTotal}},[e._v(e._s(e.totalChangeAlert))])]):e._e()])]):e._e()}),[],!1,null,null,null).exports,j=r(196);function D(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function O(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?D(Object(source),!0).forEach((function(t){Object(h.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):D(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var P={name:"DashboardHeader",components:{uiIcon:j.default},props:{raise:Boolean,searching:Boolean},data:function(){return{icons:[{name:"bell",title:"notifications"},{name:"accountMultiple",title:"contact"}],showSearchInput:!1}},computed:{mobileHeader:function(){return/xxs|xs|sm|md/.test(this.$store.state.breakpoints.is)},user:function(){return this.$store.state.user||{}},userImage:function(){return this.user.image||"/samples/people/boy-snow-hoodie"},searchQuery:function(){return this.$route.query.query}},watch:{searching:function(e){var t=this;e?requestAnimationFrame((function(){return t.showSearchInput=!0})):this.showSearchInput=!1}},created:function(){this.showSearchInput=this.searching},methods:{searchFor:function(e){this.$router.replace({query:O(O({},this.$route.query),{},{query:e})})},clearSearch:function(){this.searchFor()},openMobileNav:function(){this.mobileHeader&&this.$commit("UPDATE",{path:"mobileNav",value:!0})},handleSearchInput:function(e){this.searchFor(e.currentTarget.value||void 0)},handleSearchBlur:function(){this.$route.query.query||this.clearSearch()}}},A=(r(548),{name:"DashboardPage",components:{SideNav:_,Header:Object(w.a)(P,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("header",{staticClass:"h-[64px] lg:h-[80px] w-full lg:w-[calc(100vw-280px)] lg:left-[280px] grid gap-x-1 justify-between pl-4 pr-6 grid-flow-col items-center fill-before-after before:border-b before:border-black before:border-opacity-10 dark:before:border-white dark:before:border-opacity-10 before:transition-opacity after",class:{"before:opacity-0":!e.raise,"before:opacity-100":e.raise},staticStyle:{background:"var(--theme-background)"}},[r("div",[e.mobileHeader?r("ui-btn",{staticClass:"p-0 w-[48px] h-[48px] rounded-full mr-1 transform-gpu",class:{"scale-0 opacity-0 pointer-events-none":e.searching},attrs:{title:"search",tabindex:e.searching?"-1":void 0},on:{click:e.openMobileNav}},[r("ui-icon",{attrs:{name:"menu",size:"20px"}})],1):e._e(),e._v(" "),r("ui-btn",{staticClass:"p-0 w-[48px] h-[48px] rounded-full transform-gpu",class:{"translate-x-[calc(0px-100%-1rem)]":e.searching&&e.mobileHeader},attrs:{title:"search",to:"/dashboard/search",tabindex:"-1"}},[r("ui-icon",{attrs:{name:"magnify",size:"20px"}})],1)],1),e._v(" "),r("div",{staticClass:"flex items-center"},[r("ui-btn",{staticClass:"p-0 w-[48px] h-[48px] rounded-full transform-gpu",class:{"scale-0 opacity-0 pointer-events-none":e.searching},style:{"transition-delay":e.searching?void 0:"60ms"},attrs:{title:"toggle theme",tabindex:e.searching?"-1":void 0},on:{click:function(t){e.$theme.light=!e.$theme.light}}},[r("ui-icon",{attrs:{name:e.$theme.light?"lightMode":"darkMode",size:"20px"}})],1),e._v(" "),e._l(e.icons,(function(t,i){return r("ui-btn",{key:i,staticClass:"p-0 w-[48px] h-[48px] rounded-full transform-gpu",class:{"scale-0 opacity-0 pointer-events-none":e.searching},style:{"transition-delay":e.searching?30*(i+1)+"ms":30*(e.icons.length-(i+1))+"ms"},attrs:{title:t.title,tabindex:e.searching?"-1":void 0}},[r("ui-icon",{attrs:{size:"20px",name:t.name},on:{click:function(){return e.$commit("UPDATE",{path:"mobileNav",value:!0})}}})],1)})),e._v(" "),r("ui-btn",{staticClass:"p-0 w-[32px] h-[32px] min-h-[32px] rounded-full transform-gpu",class:{"scale-0 opacity-0 pointer-events-none":e.searching},style:{"transition-delay":e.searching?"60ms":void 0},attrs:{title:"profile",tabindex:e.searching?"-1":void 0}},[r("app-img",{staticClass:"object-cover",attrs:{"public-id":e.userImage,height:"32px",width:"32px",radius:"max","fetch-format":"auto",quality:"100"}})],1)],2),e._v(" "),e.showSearchInput?r("form",{staticClass:"absolute w-full h-full fade-appear",attrs:{action:".",name:"search-app"}},[r("input",{staticClass:"w-full h-full pl-[48px] lg:pl-[calc(48px+1rem)] pr-[calc(2rem+32px)] bg-[transparent] rounded-none appearance-none input",attrs:{type:"search",autofocus:"",placeholder:"Search products"},domProps:{value:e.searchQuery},on:{input:e.handleSearchInput,blur:e.handleSearchBlur}}),e._v(" "),e.searchQuery?r("ui-btn",{staticClass:"h-[32p] min-h-[32px] w-[32px] rounded-full absolute right-3 top-[50%] translate-y-[-50%]",on:{click:e.clearSearch}},[r("ui-icon",{attrs:{name:"close"}})],1):e._e()],1):e._e()])}),[],!1,null,null,null).exports,UiIcon:j.default,ProcessDialog:$},data:function(){return{authenticated:!1,raiseHeader:!1}},computed:{canRaiseHeader:function(){return this.isSearch||this.raiseHeader},isSearch:function(){return/\/search\/?$/.test(this.$route.path)},renderToggleBalance:function(){return this.$store.getters.renderToggleBalance},showBalance:function(){return this.$store.state.showBalance},showBalanceIcon:function(){return this.showBalance?"eyeOff":"eye"},userInfo:function(){return this.$store.getters.userInfo},isBuyer:function(){return this.userInfo.isBuyer},totalDeposit:function(){var e=this.userInfo,t=e[e.isBuyer?"depositTotal":"incomeTotal"]||0;return this.showBalance?t:"*".repeat(5)},renderBackdrop:function(){return this.miniDevice||this.isProcessing},errorPage:function(){return this.$route.params.error},user:function(){return this.$store.state.user},showBanner:function(){return!!this.$store.state.bannerActive&&(!/^\/dashboard\/(reset-deposit|shop|create-product|account|search)\/?$/.test(this.$route.path)&&!this.errorPage)},showTotalBalance:function(){return!/^\/dashboard\/(reset-deposit|shop)\/?$/.test(this.$route.path)},showTitle:function(){return!/^\/dashboard\/reset-deposit\/?$/.test(this.$route.path)},notify:function(){return this.$store.state.notify},notifyMessage:function(){return this.notify.message},breadcrumbs:function(){var e=this,t=this.$route;if(/^\/dashboard\/?$/.test(t.path)||/^\/dashboard\/(account)\/?$/.test(this.$route.path))return null;var output=[],r=t.fullPath.replace(/\?.+=|&.+=/g,"/").split("/").filter(Boolean);return r.forEach((function(path,i,t){var title=path;title=/^p-/.test(title)?e.$store.state.productName||"loading title":title.replace(/-/g," "),output.push({title:decodeURI(Object(main.c)(title)),active:i==t.length-1,to:"/".concat(r.filter((function(e,t){return t-1<i})).join("/"))})})),output},miniDevice:function(){return!!this.$ui.mounted&&/xxs|xs|sm|md/.test(this.$store.state.breakpoints.is)},mobileNav:function(){return this.$store.state.mobileNav&&this.miniDevice},isProcessing:function(){return this.$store.state.dashboardProcessing},backdropValue:function(){return this.mobileNav||this.isProcessing?1:0},media:function(){return this.$store.state.media},pageTitle:function(){var e,t=this.$route;return(null===(e=[{active:/^\/dashboard\/?$/.test(t.path),title:"Good ".concat(this.$store.state.greeting,".")},{active:/^\/dashboard\/deposit\/?$/.test(t.path),title:"Deposit"},{active:/^\/dashboard\/reset-deposit\/?$/.test(t.path),title:"Reset deposit"},{active:/^\/dashboard\/shop/.test(t.path),title:"Shop"},{active:/^\/dashboard\/create-product/.test(t.path),title:"Create product"},{active:/^\/dashboard\/my-products/.test(t.path)&&!this.$route.query.edit,title:"My products"},{active:/^\/dashboard\/my-products/.test(t.path)&&this.$route.query.edit,title:"Edit product"},{active:/^\/dashboard\/search/.test(t.path)&&!this.$route.query.query,title:"Search app"},{active:/^\/dashboard\/search/.test(t.path)&&this.$route.query.query,title:"Searching"},{active:/^\/dashboard\/account/.test(t.path),title:"Account"}].find((function(e){return e.active})))||void 0===e?void 0:e.title)||"Error"}},watch:{notifyMessage:function(e){var t=this;return Object(o.a)(regeneratorRuntime.mark((function r(){var o,n;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(o=t.notify,!e||!o.timeout){r.next=6;break}return n=o.key,r.next=5,t.$sleep(o.timeout);case 5:n==t.notify.key&&t.closeNotification();case 6:case"end":return r.stop()}}),r)})))()}},beforeMount:function(){var e=this;this.redirectUnauthorized("buyer",["create-product","my-products"]),this.redirectUnauthorized("seller",["deposit","reset","shop","shop?id=.+"]),this.$nextTick((function(){e.authenticated=!0}))},mounted:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.$sleep(500);case 2:null!==(r=e.user)&&void 0!==r&&r.alert&&e.$commit("UPDATE",{path:"notify",value:{message:e.user.alert,warn:!0,closeText:"End sessions",callback:function(){var t=Object(o.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.logoutAll.call(e,{notCurrent:!0});case 2:e.$commit("UPDATE",{path:"notify",value:{message:"Other sessions successfully terminated",key:Date.now(),timeout:1500}});case 3:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),key:Date.now(),timeout:15e3}});case 3:case"end":return t.stop()}}),t)})))()},methods:{notificationPrimaryAction:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e.notify.closeText){t.next=5;break}return t.next=3,e.notify.callback();case 3:t.next=6;break;case 5:e.closeNotification();case 6:case"end":return t.stop()}}),t)})))()},hideBackdrop:function(){this.$store.state.user||this.$router.replace("/"),this.closeNav(),this.$commit("UPDATE",{path:"dashboardProcessing",value:!1})},intersectionUpdated:function(e){this.raiseHeader=!e.isIntersecting},redirectUnauthorized:function(e,t){var r,o=this.$route;if((null===(r=this.user)||void 0===r?void 0:r.role)==e&&t.find((function(e){return new RegExp("^/dashboard/".concat(e,"/?")).test(o.path)})))return this.$router.replace("/dashboard/unauthorized")},caps:function(e){return Object(main.c)(e)},closeNav:function(){this.$commit("UPDATE",{path:"mobileNav",value:!1})},closeNotification:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.$sleep(200);case 2:e.$commit("UPDATE",{path:"notify",value:{message:null,key:Date.now()}});case 3:case"end":return t.stop()}}),t)})))()},closeBanner:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.$commit("UPDATE",{path:"bannerActive",value:!1}),t.next=3,e.$apiCall("user","PATCH",{showBanner:!1});case 3:return t.next=5,e.$refreshUser();case 5:case"end":return t.stop()}}),t)})))()}}}),S=A,N=Object(w.a)(S,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("article",{staticClass:"w-100 grid grid-cols-1 fade-appear",class:{invisible:!e.user}},[e.renderBackdrop?r("div",{staticClass:"h-full w-full fixed top-0 left-0 bg-black transition-opacity z-20 fade-appear",class:{"opacity-1":e.backdropValue,"opacity-0":!e.backdropValue,"pointer-events-none":!e.backdropValue,"bg-opacity-50":!e.isProcessing,"bg-opacity-70":e.isProcessing},on:{click:e.hideBackdrop}},[r("process-dialog")],1):e._e(),e._v(" "),r("sideNav",{key:e.miniDevice,attrs:{"mini-device":e.miniDevice,"mobile-nav":e.mobileNav,"close-nav":e.closeNav}}),e._v(" "),r("div",{staticClass:"mr-0 mx-0 w-full xl:mr-auto lg:max-w-[calc(100%-280px)] lg:mr-0 lg:ml-[280px] grid justify-center relative"},[!e.errorPage||e.miniDevice?r("Header",{staticClass:"fixed top-0 z-10",attrs:{raise:e.canRaiseHeader,searching:e.isSearch}}):e._e(),e._v(" "),r("ui-intersection",{on:{"on-update":e.intersectionUpdated}},[r("div",{staticClass:"h-[1px] w-full absolute invisible",attrs:{"aria-hidden":"true"}})]),e._v(" "),r("div",{key:e.$route.path,staticClass:"grid gap-y-6 w-screen content-start lg:w-[calc(100vw-280px)] xl:w-[calc(calc(min(100vw,1920px)-3rem)-280px)] max-w-full fade-appear pb-10",class:{"mt-[80px] lg:mt-[100px]":!e.errorPage,invisible:!e.authenticated}},[e.errorPage?e._e():r("div",{staticClass:"grid grid-flow-col justify-between px-6"},[r("h2",{staticClass:"text-3xl font-bold tracking-tight"},[e._v(e._s(e.pageTitle))])]),e._v(" "),e.showTotalBalance||e.errorPage?e._e():r("p",{staticClass:"px-6 font-semibold opacity-70 text-sm flex items-center"},[e._v("\n                Total "+e._s(e.isBuyer?"deposit":"income")+":\n                "),r("span",{key:e.showBalanceIcon,staticClass:"ml-2 fade-appear inline-block"},[e._v(e._s(e.totalDeposit))]),e._v(" "),e.renderToggleBalance?r("ui-btn",{staticClass:"ml-1 min-h-[38px]",attrs:{title:e.showBalance?"hide balance":"show balance"},on:{click:e.$toggleShowBalance}},[r("ui-icon",{attrs:{name:e.showBalanceIcon,size:"18"}})],1):e._e()],1),e._v(" "),e.breadcrumbs&&e.showTitle&&!e.errorPage?r("ul",{staticClass:"grid grid-flow-col justify-start ml-6"},e._l(e.breadcrumbs,(function(path,i){return r("li",{key:i,staticClass:"flex justify-between items-center text-[0.925rem]"},[r("nuxt-link",{staticClass:"hover:underline",class:[{"font-light opacity-70 text-[0.8rem]":path.active}],attrs:{disabled:path.active,tabindex:path.active?"-1":void 0,to:path.to}},[e._v(e._s(path.title))]),e._v(" "),i<e.breadcrumbs.length-1?r("div",{staticClass:"mx-3 opacity-40"},[e._v("•")]):e._e()],1)})),0):e._e(),e._v(" "),e.showBanner?r("div",{staticClass:"rounded-md bg-gradient-to-b md:bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-600 text-white dark:text-blue-gray-900 p-8 grid md:grid-flow-col md:grid-cols-[auto 1fr] justify-start gap-x-4 mx-6 fade-slide-y-appear",staticStyle:{"--slide-y":"10px","--appear-duration":"150ms"}},[r("div",{staticClass:"w-[200px] h-[200px] mx-auto"},[r("app-img",{attrs:{width:"200px",height:"200px","public-id":e.media.welcome}})],1),e._v(" "),r("div",[r("div",{staticClass:"bg-teal-600 font-medium text-white dark:text-black rounded-lg h-[32px] px-[10px] inline-grid place-items-center text-sm mb-4"},[e._v("New")]),e._v(" "),r("h3",{staticClass:"text-lg font-bold mb-2"},[e._v("Welcome to the Vending app")]),e._v(" "),r("h4",{staticClass:"mb-8 text-[0.95rem] font-medium text-opacity-70 dark:text-opacity-80 text-white dark:text-blue-gray-900"},[e._v("Your dashboard has been improved! Explore features like Orders, Account, Transactions and more.")]),e._v(" "),r("ui-btn",{staticClass:"bg-teal-600 px-4 text-white dark:text-black rounded-sm",on:{click:e.closeBanner}},[e._v("Dismiss banner")])],1)]):e._e(),e._v(" "),r("nuxt-child",{key:e.$route.fullPath}),e._v(" "),r("div",{staticClass:"z-10 fixed h-full bottom-0 pointer-events-none grid items-end md:max-w-full mx-auto justify-center left-0 lg:left-[280px] w-full lg:w-[calc(100vw-280px)]"},[r("transition",{attrs:{name:"anim-slide-y",type:"animation",mode:"out-in"}},[e.notifyMessage?r("div",{key:e.notify.key+e.$route.path,staticClass:"border p-6 rounded-md my-6 mx-8 pointer-events-auto w-[min(calc(100vw-2rem),450px)] text-black text-opacity-80 shadow-lg grid grid-cols-[1fr,auto] gap-x-2 max-w-[500px] z-[1]",class:{"transition-opacity opacity-0":!e.notifyMessage,"border-green-400 dark:border-green-200 bg-green-500 dark:bg-green-300":!e.notify.error&&!e.notify.warn,"border-red-400 dark:border-red-200 bg-red-500 dark:bg-red-300":e.notify.error,"border-amber-400 dark:border-amber-200 bg-amber-500 dark:bg-amber-300":e.notify.warn}},[e._v("\n                        "+e._s(e.caps(e.notifyMessage))+"\n                        "),r("div",{staticClass:"grid gap-y-2"},[r("ui-btn",{staticClass:"rounded-sm",class:[{"p-0 w-[48px] h-[48px] rounded-full text-opacity-80":!e.notify.closeText,"text-sm":e.notify.closeText,"bg-amber-700 dark:bg-amber-500 bg-opacity-50 dark:bg-opacity-50":e.notify.closeText&&e.notify.warn,"bg-red-700 dark:bg-red-500 bg-opacity-50 dark:bg-opacity-50":e.notify.closeText&&e.notify.error}],on:{click:e.notificationPrimaryAction}},[e.notify.closeText?[e._v(e._s(e.notify.closeText))]:r("ui-icon",{attrs:{name:"close",size:"20px"}})],2),e._v(" "),e.notify.closeText?r("ui-btn",{staticClass:"rounded-sm text-sm",on:{click:e.closeNotification}},[e._v("Cancel")]):e._e()],1)]):e._e()])],1)],1)],1)],1)}),[],!1,null,null,null);t.default=N.exports}}]);
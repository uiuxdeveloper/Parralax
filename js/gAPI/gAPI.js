// classy.js Controller
  !function(e){if(typeof module!="undefined"&&module.exports)module.exports=e();else if(typeof define=="function"&&typeof define.amd=="object")define(e);else this.Class=e()}(function(e){function o(e){return!s||/\B\$super\b/.test(e.toString())}function u(t,n,r){if(r===e)delete t[n];else t[n]=r}function a(t,n){return Object.prototype.hasOwnProperty.call(t,n)?t[n]:e}function f(e){i=true;var t=new e;i=false;return t}var t="1.4",n=this,r=n.Class,i=false;var s=function(){$super()}.toString().indexOf("$super")>0;var l=function(){};l.$noConflict=function(){try{u(n,"Class",r)}catch(e){n.Class=r}return l};l.$classyVersion=t;l.$extend=function(t){var r=this.prototype;var s=f(this);if(t.__include__)for(var c=0,h=t.__include__.length;c!=h;++c){var p=t.__include__[c];for(var d in p){var v=a(p,d);if(v!==e)s[d]=p[d]}}t.__classvars__=t.__classvars__||{};if(s.__classvars__)for(var m in s.__classvars__)if(!t.__classvars__[m]){var v=a(s.__classvars__,m);t.__classvars__[m]=v}for(var d in t){var v=a(t,d);if(d==="__include__"||v===e)continue;s[d]=typeof v==="function"&&o(v)?function(e,t){return function(){var n=a(this,"$super");this.$super=r[t];try{return e.apply(this,arguments)}finally{u(this,"$super",n)}}}(v,d):v}var g=function(){if(i)return;var e=n===this?f(arguments.callee):this;if(e.__init__)e.__init__.apply(e,arguments);e.$class=g;return e};for(var m in t.__classvars__){var v=a(t.__classvars__,m);if(v!==e)g[m]=v}g.prototype=s;g.constructor=g;g.$extend=l.$extend;g.$withData=l.$withData;return g};l.$withData=function(t){var n=f(this);for(var r in t){var i=a(t,r);if(i!==e)n[r]=i}return n};return l})
//
//
//
//
// gAPI core
  var gapi =  Class.$extend({});
//
//
//
//
// Performance
  $(window).load(function() {
      $( '.loadOWR' ).each( function(){                                // Delay load of DOM images using class="loadOWR" (load on window ready)
          $( this ).attr('src', $( this).attr('data-src') );
      });
  });
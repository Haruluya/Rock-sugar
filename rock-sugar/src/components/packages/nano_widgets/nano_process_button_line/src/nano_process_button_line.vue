<template>
    <div class="compContainer">
        <div :class="{
                'dotstyle':true,
                'dotstyle-fillup':prop_category==='default', 
                'dotstyle-scaleup':prop_category==='scaleup',
                'dotstyle-stroke':prop_category==='stroke',
                'dotstyle-fillin':prop_category==='fillin',
            }">

            <ul>
                <li :class="{'current':index === idx}" v-for="(item,index) in prop_item_title" >
                    <a></a>
                </li>
                <div class="centerLine">
                </div>
            </ul>
        </div>
        <div class="processContainer">
            <div :class="{'item':true,'current':index === idx}" v-for="(item,index) in prop_item_title" >
                {{item}}
            </div>
        </div>
    </div>
</template>
<script>



export default {
    name:"nano_process_button_line",
    data() {
        return {
            idx:0,
        }
    },
    mounted() {

        // animation.
        (function( window ) {
            'use strict';

            function extend( a, b ) {
                for( var key in b ) { 
                    if( b.hasOwnProperty( key ) ) {
                        a[key] = b[key];
                    }
                }
                return a;
            }

            function DotNav( el, options ) {
                this.nav = el;
                this.options = extend( {}, this.options );
                extend( this.options, options );
                this._init();
            }

            DotNav.prototype.options = {};

            DotNav.prototype._init = function() {
                var hop = this.nav.parentNode.className.indexOf( 'dotstyle-hop' ) !== -1;

                var dots = [].slice.call( this.nav.querySelectorAll( 'li' ) ), current = 0, self = this;

                dots.forEach( function( dot, idx ) {
                    dot.addEventListener( 'click', function( ev ) {
                        ev.preventDefault();
                        if( idx !== current ) {
                            dots[ current ].className = '';

                            if( hop && idx < current ) {
                                dot.className += ' current-from-right';
                            }

                            setTimeout( function() {
                                dot.className += ' current';
                                current = idx;
                                if( typeof self.options.callback === 'function' ) {
                                    self.options.callback( current );
                                }
                            }, 25 );						
                        }
                    } );
                } );
            }

            window.DotNav = DotNav;

        })( window );

        [].slice.call(document.querySelectorAll('.dotstyle > ul')).forEach((nav)=>{
            new DotNav(nav,{
                callback : (idx)=>{
                    this.idx = idx;
                }
            });
        });
    },
    props:{
        prop_category:{
            type:String,
            default:"default",
            required:false
        },
        prop_item_title:{
            type:Array,
            default:[],
            required:true,
        }
    }
}
</script>
<style lang="less" scoped>
@import "./nano_process_button_line.less";
</style>
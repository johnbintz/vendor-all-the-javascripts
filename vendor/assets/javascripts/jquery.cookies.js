/**
 * jquery.cookies.js
 *
 * Copyright (c) 2005 - 2011, James Auldridge
 * All rights reserved.
 *
 * Licensed under the BSD, MIT, and GPL (your choice!) Licenses:
 *    @link http://code.google.com/p/cookies/wiki/License
 *
 */
( function( global )
{
    "use strict";

        /* localize 3rd party support */
    var $ = global.jQuery,
        /* localize first party support */
        jaaulde = global.jaaulde,
        cookies = jaaulde.utils.cookies,
        /* declarations */
        NameTokenAttrResolver;

    /* alias cookies lib under jQ to meet general audience expectations */
    $.cookies = cookies;

    NameTokenAttrResolver = function()
    {
        var nameTokenAttrs = ['name', 'id'];
        this.current = null;
        this.nextAttrName = function()
        {
            this.current = nameTokenAttrs.shift();
            return !! this.current;
        };
    };

    $.each( {
        /**
         * $( 'selector' ).cookify - set the value of an input field, or the innerHTML of an element, to a cookie by the name or id of the field or element
         *                           (field or element MUST have name or id attribute)
         *
         * @access public
         * @param options OBJECT - list of cookie options to specify
         * @return jQuery
         */
        cookify: function( options )
        {
             this
                .not( ':input' )
                    /*
                        Iterate non input elements
                    */
                    .each( function()
                    {
                        var $this, NTAR, nameToken, value;

                        $this = $( this );

                        NTAR = new NameTokenAttrResolver();

                        while( NTAR.nextAttrName() )
                        {
                            nameToken = $this.attr( NTAR.current );
                            if( typeof nameToken === 'string' && nameToken !== '' )
                            {
                                value = $this.html();

                                cookies.set(
                                    nameToken,
                                    ( typeof value === 'string' && value !== '' ) ? value : null,
                                    options
                                );

                                break;
                            }
                        }
                    } )
                    .end()
                .filter( ':input')
                    .filter( ':radio' )
                    /*
                        Iterate radio inputs
                    */
                    .each( function()
                    {

                    } )
                    .end()
                .filter( ':checkbox' )
                /*
                    Iterate checkbox inputs
                */
                .each( function()
                {

                } )
                .end()
            .not( ':radio, :checkbox' )
                /*
                    Iterate all other inputs
                */
                .each( function()
                {
                    var $this, NTAR, nameToken, value;

                    $this = $( this );

                    NTAR = new NameTokenAttrResolver();

                    while( NTAR.nextAttrName() )
                    {
                        nameToken = $this.attr( NTAR.current );
                        if( typeof nameToken === 'string' && nameToken !== '' )
                        {
                            value = $this.val();

                            cookies.set(
                                nameToken,
                                ( typeof value === 'string' && value !== '' ) ? value : null,
                                options
                            );

                            break;
                        }
                    }
                } );

                return this;
        },
        /**
         * $( 'selector' ).cookieFill - set the value of an input field or the innerHTML of an element from a cookie by the name or id of the field or element
         *
         * @access public
         * @return jQuery
         */
        cookieFill: function()
        {
            this
                .not( ':input' )
                    /*
                        Iterate non input elements
                    */
                    .each( function()
                    {
                        var $this, NTAR, nameToken, value;

                        $this = $( this );

                        NTAR = new NameTokenAttrResolver();

                        while( NTAR.nextAttrName() )
                        {
                            nameToken = $this.attr( NTAR.current );
                            if( typeof nameToken === 'string' && nameToken !== '' )
                            {
                                value = cookies.get( nameToken );
                                if( value !== null )
                                {
                                    $this.html( value );
                                }

                                break;
                            }
                        }
                    } )
                    .end()
                .filter( ':input')
                    .filter( ':radio' )
                        /*
                            Iterate radio inputs
                        */
                        .each( function()
                        {

                        } )
                        .end()
                    .filter( ':checkbox' )
                        /*
                            Iterate checkbox inputs
                        */
                        .each( function()
                        {

                        } )
                        .end()
                    .not( ':radio, :checkbox' )
                        /*
                            Iterate all other inputs
                        */
                        .each( function()
                        {
                            var $this, NTAR, nameToken, value;

                            $this = $( this );

                            NTAR = new NameTokenAttrResolver();

                            while( NTAR.nextAttrName() )
                            {
                                nameToken = $this.attr( NTAR.current );
                                if( typeof nameToken === 'string' && nameToken !== '' )
                                {
                                    value = cookies.get( nameToken );
                                    if( value !== null )
                                    {
                                        $this.val( value );
                                    }

                                    break;
                                }
                            }
                        } );

            return this;
        },
        /**
         * $( 'selector' ).cookieBind - call cookie fill on matching elements, and bind their change events to cookify()
         *
         * @access public
         * @param options OBJECT - list of cookie options to specify
         * @return jQuery
         */
        cookieBind: function( options )
        {
            return this.each( function()
            {
                var $this = $( this );
                $this.cookieFill().change( function()
                {
                    $this.cookify( options );
                } );
            } );
        }
    }, function( i )
    {
        $.fn[i] = this;
    } );
}( window ) );
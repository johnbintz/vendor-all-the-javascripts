/**
 * jaaulde.cookies.js
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

        /* localize globals */
    var document = global.document,
        Object = global.Object,
        JSON = global.JSON,
        /* localize first party support */
        jaaulde = global.jaaulde = ( global.jaaulde || {} );

    /*
     * jaaulde.utils Namespace
     */
    jaaulde.utils = jaaulde.utils || {};

    /*
     * The library
     */
    jaaulde.utils.cookies = ( function()
    {
        var defaultOptions,
            resolveOptions, assembleOptionsString, isNaN, trim, parseCookies, Constructor;

        defaultOptions = {
            expiresAt: null,
            path: '/',
            domain: null,
            secure: false
        };

        resolveOptions = function( options )
        {
            var returnValue, expireDate;

            if( typeof options !== 'object' || options === null )
            {
                returnValue = defaultOptions;
            }
            else
            {
                returnValue = {
                    expiresAt: defaultOptions.expiresAt,
                    path: defaultOptions.path,
                    domain: defaultOptions.domain,
                    secure: defaultOptions.secure
                };

                if( typeof options.expiresAt === 'object' && options.expiresAt instanceof Date )
                {
                    returnValue.expiresAt = options.expiresAt;
                }
                else if( typeof options.hoursToLive === 'number' && options.hoursToLive !== 0 )
                {
                    expireDate = new global.Date();
                    expireDate.setTime( expireDate.getTime() + ( options.hoursToLive * 60 * 60 * 1000 ) );
                    returnValue.expiresAt = expireDate;
                }

                if( typeof options.path === 'string' && options.path !== '' )
                {
                    returnValue.path = options.path;
                }

                if( typeof options.domain === 'string' && options.domain !== '' )
                {
                    returnValue.domain = options.domain;
                }

                if( options.secure === true )
                {
                    returnValue.secure = options.secure;
                }
            }

            return returnValue;
        };

        assembleOptionsString = function( options )
        {
            options = resolveOptions( options );

            return (
                ( typeof options.expiresAt === 'object' && options.expiresAt instanceof Date ? '; expires=' + options.expiresAt.toGMTString() : '' ) +
                '; path=' + options.path +
                ( typeof options.domain === 'string' ? '; domain=' + options.domain : '' ) +
                ( options.secure === true ? '; secure' : '' )
            );
        };

        /**
         * Some logic borrowed from http://jquery.com/
         */
        trim = global.String.prototype.trim ?
            function( data )
            {
                return global.String.prototype.trim.call( data );
            } :
            ( function()
            {
                var trimLeft, trimRight;

                trimLeft = /^\s+/;
                trimRight = /\s+$/;

                return function( data )
                {
                    return data.replace( trimLeft, '' ).replace( trimRight, '' );
                };
            }() );

        /**
         * Borrowed from http://jquery.com/
         */
        isNaN = ( function()
        {
            var rdigit = /\d/, isNaN = global.isNaN;
            return function( obj )
            {
                return ( obj === null || ! rdigit.test( obj ) || isNaN( obj ) );
            };
        }() );

        parseCookies = ( function()
        {
            var parseJSON, rbrace;

            parseJSON = JSON && JSON.parse ?
                function( data )
                {
                    var returnValue = null;

                    if( typeof data === 'string' && data !== '' )
                    {
                        // Make sure leading/trailing whitespace is removed (IE can't handle it)
                        data = trim( data );

                        if( data !== '' )
                        {
                            try
                            {
                                returnValue = JSON.parse( data );
                            }
                            catch( e1 )
                            {
                                returnValue = null;
                            }
                        }
                    }

                    return returnValue;
                } :
                function()
                {
                    return null;
                };

            rbrace = /^(?:\{.*\}|\[.*\])$/;

            return function()
            {
                var cookies, splitOnSemiColons, cookieCount, i, splitOnEquals, name, rawValue, value;

                cookies = {};
                splitOnSemiColons = document.cookie.split( ';' );
                cookieCount = splitOnSemiColons.length;

                for( i = 0; i < cookieCount; i = i + 1 )
                {
                    splitOnEquals = splitOnSemiColons[i].split( '=' );

                    name = trim( splitOnEquals.shift() );
                    if( splitOnEquals.length >= 1 )
                    {
                        rawValue = splitOnEquals.join( '=' );
                    }
                    else
                    {
                        rawValue = '';
                    }

                    try
                    {
                        value = decodeURIComponent( rawValue );
                    }
                    catch( e2 )
                    {
                        value = rawValue;
                    }

                    //Logic borrowed from http://jquery.com/ dataAttr method
                    try
                    {
                        value = value === 'true' ?
                            true :
                            value === 'false' ?
                                false :
                                ! isNaN( value ) ?
                                    parseFloat( value ) :
                                    rbrace.test( value ) ?
                                        parseJSON( value ) :
                                        value;
                    }
                    catch( e3 ) {}

                    cookies[name] = value;
                }
                return cookies;
            };
        }() );

        Constructor = function(){};

        /**
         * get - get one, several, or all cookies
         *
         * @access public
         * @paramater Mixed cookieName - String:name of single cookie; Array:list of multiple cookie names; Void (no param):if you want all cookies
         * @return Mixed - Value of cookie as set; Null:if only one cookie is requested and is not found; Object:hash of multiple or all cookies (if multiple or all requested);
         */
        Constructor.prototype.get = function( cookieName )
        {
            var returnValue, item, cookies;

            cookies = parseCookies();

            if( typeof cookieName === 'string' )
            {
                returnValue = ( typeof cookies[cookieName] !== 'undefined' ) ? cookies[cookieName] : null;
            }
            else if( typeof cookieName === 'object' && cookieName !== null )
            {
                returnValue = {};
                for( item in cookieName )
                {
                    if( Object.prototype.hasOwnProperty.call( cookieName, item ) )
                    {
                        if( typeof cookies[cookieName[item]] !== 'undefined' )
                        {
                            returnValue[cookieName[item]] = cookies[cookieName[item]];
                        }
                        else
                        {
                            returnValue[cookieName[item]] = null;
                        }
                    }
                }
            }
            else
            {
                returnValue = cookies;
            }

            return returnValue;
        };
        /**
         * filter - get array of cookies whose names match the provided RegExp
         *
         * @access public
         * @paramater Object RegExp - The regular expression to match against cookie names
         * @return Mixed - Object:hash of cookies whose names match the RegExp
         */
        Constructor.prototype.filter = function( cookieNameRegExp )
        {
            var cookieName, returnValue, cookies;

            returnValue = {};
            cookies = parseCookies();

            if( typeof cookieNameRegExp === 'string' )
            {
                cookieNameRegExp = new RegExp( cookieNameRegExp );
            }

            for( cookieName in cookies )
            {
                if( Object.prototype.hasOwnProperty.call( cookies, cookieName ) && cookieName.match( cookieNameRegExp ) )
                {
                    returnValue[cookieName] = cookies[cookieName];
                }
            }

            return returnValue;
        };
        /**
         * set - set or delete a cookie with desired options
         *
         * @access public
         * @paramater String cookieName - name of cookie to set
         * @paramater Mixed value - Any JS value. If not a string, will be JSON encoded (http://code.google.com/p/cookies/wiki/JSON); NULL to delete
         * @paramater Object options - optional list of cookie options to specify
         * @return void
         */
        Constructor.prototype.set = function( cookieName, value, options )
        {
            if( typeof options !== 'object' || options === null )
            {
                options = {};
            }

            // TODO: consider value serialization method to parallel parse cookies
            if( typeof value === 'undefined' || value === null )
            {
                value = '';
                options.hoursToLive = -8760;
            }
            else
            {
                //Logic borrowed from http://jquery.com/ dataAttr method and reversed
                value = value === true ?
                        'true' :
                        value === false ?
                            'false' :
                            ! isNaN( value ) ?
                                '' + value :
                                value;
                if( typeof value !== 'string' )
                {
                    if( typeof JSON === 'object' && JSON !== null && typeof JSON.stringify === 'function' )
                    {
                        value = JSON.stringify( value );
                    }
                    else
                    {
                        throw new Error( 'cookies.set() received value which could not be serialized.' );
                    }
                }
            }

            var optionsString = assembleOptionsString( options );

            document.cookie = cookieName + '=' + encodeURIComponent( value ) + optionsString;
        };
        /**
         * del - delete a cookie (domain and path options must match those with which the cookie was set; this is really an alias for set() with parameters simplified for this use)
         *
         * @access public
         * @paramater MIxed cookieName - String name of cookie to delete, or Bool true to delete all
         * @paramater Object options - optional list of cookie options to specify ( path, domain )
         * @return void
         */
        Constructor.prototype.del = function( cookieName, options )
        {
            var allCookies, name;

            allCookies = {};

            if( typeof options !== 'object' || options === null )
            {
                options = {};
            }

            if( typeof cookieName === 'boolean' && cookieName === true )
            {
                allCookies = this.get();
            }
            else if( typeof cookieName === 'string' )
            {
                allCookies[cookieName] = true;
            }

            for( name in allCookies )
            {
                if( Object.prototype.hasOwnProperty.call( allCookies, name ) && typeof name === 'string' && name !== '' )
                {
                    this.set( name, null, options );
                }
            }
        };
        /**
         * test - test whether the browser is accepting cookies
         *
         * @access public
         * @return Boolean
         */
        Constructor.prototype.test = function()
        {
            var returnValue, testName, testValue;

            testName = 'cookiesCT';
            testValue = 'data';

            this.set( testName, testValue );

            if( this.get( testName ) === testValue )
            {
                this.del( testName );
                returnValue = true;
            }

            return returnValue;
        };
        /**
         * setOptions - set default options for calls to cookie methods
         *
         * @access public
         * @param Object options - list of cookie options to specify
         * @return void
         */
        Constructor.prototype.setOptions = function( options )
        {
            if( typeof options !== 'object' )
            {
                options = null;
            }

            defaultOptions = resolveOptions( options );
        };

        return new Constructor();
    }() );    
}( window ) );
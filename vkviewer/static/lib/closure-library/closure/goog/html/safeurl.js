// Copyright 2013 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview The SafeUrl type and its builders.
 *
 * TODO(user): Link to document stating type contract.
 */

goog.provide('goog.html.SafeUrl');

goog.require('goog.asserts');
goog.require('goog.i18n.bidi.Dir');
goog.require('goog.i18n.bidi.DirectionalString');
goog.require('goog.string.Const');
goog.require('goog.string.TypedString');



/**
 * A string that is safe to use in URL context in DOM APIs and HTML documents.
 *
 * A SafeUrl is a string-like object that carries the security type contract
 * that its value as a string will not cause untrusted script execution
 * when evaluated as a hyperlink URL in a browser.
 *
 * Values of this type are guaranteed to be safe to use in URL/hyperlink
 * contexts, such as, assignment to URL-valued DOM properties, or
 * interpolation into a HTML template in URL context (e.g., inside a href
 * attribute), in the sense that the use will not result in a
 * Cross-Site-Scripting vulnerability.
 *
 * Note that this type's contract does not imply any guarantees regarding
 * the resource the URL refers to.  In particular, SafeUrls are <b>not<b/>
 * safe to use in a context where the referred-to resource is interpreted as
 * trusted code, e.g., as the src of a script tag.
 *
 * Instances of this type must be created via its factory methods
 * ({@code goog.html.SafeUrl.from}, {@code goog.html.SafeUrl.sanitize}, etc and
 * not by invoking its constructor.  The constructor intentionally takes no
 * parameters and the type is immutable; hence only a default instance
 * corresponding to the empty string can be obtained via constructor invocation.
 *
 * @see goog.html.SafeUrl#fromConstant
 * @see goog.html.SafeUrl#from
 * @see goog.html.SafeUrl#sanitize
 * @constructor
 * @final
 * @struct
 * @implements {goog.i18n.bidi.DirectionalString}
 * @implements {goog.string.TypedString}
 */
goog.html.SafeUrl = function() {
  /**
   * The contained value of this SafeUrl.  The field has a purposely ugly
   * name to make (non-compiled) code that attempts to directly access this
   * field stand out.
   * @private {string}
   */
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = '';

  /**
   * A type marker used to implement additional run-time type checking.
   * @see goog.html.SafeUrl#unwrap
   * @const
   * @private
   */
  this.SAFE_URL_TYPE_MARKER__GOOG_HTML_SECURITY_PRIVATE_ =
      goog.html.SafeUrl.TYPE_MARKER__GOOG_HTML_SECURITY_PRIVATE_;
};


/**
 * The innocuous string generated by goog.html.SafeUrl.sanitize when passed
 * an unsafe URL.
 *
 * about:invalid is registered in
 * http://www.w3.org/TR/css3-values/#about-invalid.
 * http://tools.ietf.org/html/rfc6694#section-2.2.1 permits about URLs to
 * contain a fragment, which is not to be considered when determining if an
 * about URL is well-known.
 *
 * Using about:invalid seems preferable to using a fixed data URL, since
 * browsers might choose to not report CSP violations on it, as legitimate
 * CSS function calls to attr() can result in this URL being produced. It is
 * also a standard URL which matches exactly the semantics we need:
 * "The about:invalid URI references a non-existent document with a generic
 * error condition. It can be used when a URI is necessary, but the default
 * value shouldn't be resolveable as any type of document".
 *
 * @const {string}
 */
goog.html.SafeUrl.INNOCUOUS_STRING = 'about:invalid#zClosurez';


/**
 * @override
 * @const
 */
goog.html.SafeUrl.prototype.implementsGoogStringTypedString = true;


/**
 * Returns this SafeUrl's value a string.
 *
 * IMPORTANT: In code where it is security relevant that an object's type is
 * indeed {@code SafeUrl}, use {@code goog.html.SafeUrl.unwrap} instead of this
 * method.
 *
 * @see goog.html.SafeUrl#unwrap
 * @override
 */
goog.html.SafeUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};


/**
 * @override
 * @const
 */
goog.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = true;


/**
 * Returns this URLs directionality, which is always {@code LTR}.
 * @override
 */
goog.html.SafeUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};


/**
 * Returns a debug string-representation of this value.
 *
 * To obtain the actual string value wrapped in a SafeUrl, use
 * {@code goog.html.SafeUrl.unwrap}.
 *
 * @see goog.html.SafeUrl#unwrap
 * @override
 */
goog.html.SafeUrl.prototype.toString = function() {
  return 'SafeUrl{' + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + '}';
};


/**
 * Performs a runtime check that the provided object is indeed a SafeUrl
 * object, and returns its value.
 * @param {!goog.html.SafeUrl} safeUrl The object to extract from.
 * @return {string} The SafeUrl object's contained string, unless the run-time
 *     type check fails. In that case, {@code unwrap} returns an innocuous
 *     string, or, if assertions are enabled, throws
 *     {@code goog.asserts.AssertionError}.
 */
goog.html.SafeUrl.unwrap = function(safeUrl) {
  // Perform additional Run-time type-checking to ensure that safeUrl is indeed
  // an instance of the expected type.  This provides some additional protection
  // against security bugs due to application code that disables type checks.
  // Specifically, the following checks are performed:
  // 1. The object is an instance of the expected type.
  // 2. The object is not an instance of a subclass.
  // 3. The object carries a type marker for the expected type. "Faking" an
  // object requires a reference to the type marker, which has names intended
  // to stand out in code reviews.
  if (safeUrl instanceof goog.html.SafeUrl &&
      safeUrl.constructor === goog.html.SafeUrl &&
      safeUrl.SAFE_URL_TYPE_MARKER__GOOG_HTML_SECURITY_PRIVATE_ ===
          goog.html.SafeUrl.TYPE_MARKER__GOOG_HTML_SECURITY_PRIVATE_) {
    return safeUrl.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  } else {
    goog.asserts.fail('expected object of type SafeUrl, got \'' +
                      safeUrl + '\'');
    return 'type_error:SafeUrl';

  }
};


/**
 * Creates a SafeUrl object from a compile-time constant string.
 *
 * Compile-time constant strings are inherently program-controlled and hence
 * trusted.
 *
 * @param {!goog.string.Const} url A compile-time-constant string from which to
 *         create a SafeUrl.
 * @return {!goog.html.SafeUrl} A SafeUrl object initialized to {@code url}.
 */
goog.html.SafeUrl.fromConstant = function(url) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(
      goog.string.Const.unwrap(url));
};


/**
 * A pattern that recognizes a commonly useful subset of URLs that satisfy
 * the SafeUrl contract.
 *
 * This regular expression matches a subset of URLs that will not cause script
 * execution if used in URL context within a HTML document. Specifically, this
 * regular expression matches if (comment from here on and regex copied from
 * Soy's EscapingConventions):
 * (1) Either a protocol in a whitelist (http, https, mailto).
 * (2) or no protocol.  A protocol must be followed by a colon. The below
 *     allows that by allowing colons only after one of the characters [/?#].
 *     A colon after a hash (#) must be in the fragment.
 *     Otherwise, a colon after a (?) must be in a query.
 *     Otherwise, a colon after a single solidus (/) must be in a path.
 *     Otherwise, a colon after a double solidus (//) must be in the authority
 *     (before port).
 *
 * The pattern disallows &, used in HTML entity declarations before
 * one of the characters in [/?#]. This disallows HTML entities used in the
 * protocol name, which should never happen, e.g. "h&#116;tp" for "http".
 * It also disallows HTML entities in the first path part of a relative path,
 * e.g. "foo&lt;bar/baz".  Our existing escaping functions should not produce
 * that. More importantly, it disallows masking of a colon,
 * e.g. "javascript&#58;...".
 *
 * @private
 * @const {!RegExp}
 */
goog.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto):|[^&:/?#]*(?:[/?#]|$))/i;


/**
 * Creates a SafeUrl object from {@code url}, validating that the input string
 * matches a pattern of commonly used safe URLs.
 *
 * Specifically, {@code url} may be a URL with the http, https, or mailto
 * scheme, or a relative URL (i.e., a URL without a scheme; specifically, a
 * scheme-relative, absolute-path-relative, or path-relative URL).
 *
 * If {@code url} fails validation, this function returns a SafeUrl object
 * containing an innocuous string, goog.html.SafeUrl.INNOCUOUS_STRING.
 *
 * @see http://url.spec.whatwg.org/#concept-relative-url
 * @param {string|!goog.string.TypedString} url The URL to validate.
 * @return {!goog.html.SafeUrl} The validated URL, wrapped as a SafeUrl.
 */
goog.html.SafeUrl.sanitize = function(url) {
  if (url.implementsGoogStringTypedString) {
    url = url.getTypedStringValue();
  } else {
    url = String(url);
  }
  if (!goog.html.SAFE_URL_PATTERN_.test(url)) {
    url = goog.html.SafeUrl.INNOCUOUS_STRING;
  }
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(
      url);
};


/**
 * Coerces an arbitrary object into a SafeUrl object.
 *
 * If {@code url} is already of type {@code goog.html.SafeUrl}, the same object
 * is returned. Otherwise, url is coerced to string, and passed through
 * {@code goog.html.SafeUrl.sanitize}.
 *
 * @see goog.html.SafeUrl#sanitize
 * @param {!goog.html.SafeUrl|string|!goog.string.TypedString} url The text
 *     or SafeUrl to coerce.
 * @return {!goog.html.SafeUrl} The resulting SafeUrl object.
 */
goog.html.SafeUrl.from = function(url) {
  if (url instanceof goog.html.SafeUrl) {
    return url;
  } else {
    return goog.html.SafeUrl.sanitize(url);
  }
};


/**
 * Type marker for the SafeUrl type, used to implement additional run-time
 * type checking.
 * @const
 * @private
 */
goog.html.SafeUrl.TYPE_MARKER__GOOG_HTML_SECURITY_PRIVATE_ = {};


/**
 * Utility method to create SafeUrl instances.
 *
 * This function is considered "package private", i.e. calls (using "suppress
 * visibility") from other files within this package are considered acceptable.
 * DO NOT call this function from outside the goog.html package; use appropriate
 * wrappers instead.
 *
 * @param {string} url The string to initialize the SafeUrl object with.
 * @return {!goog.html.SafeUrl} The initialized SafeUrl object.
 * @private
 */
goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_ = function(
    url) {
  var safeUrl = new goog.html.SafeUrl();
  safeUrl.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = url;
  return safeUrl;
};

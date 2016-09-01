/**
 * Created by duo on 2016/9/1.
 */
CMD.register("util.DOMParser", function () {
    function DOMParser(e) {
        this.options = e || {
                locator: {}
            };
    }

    function t(e, t, i) {
        function o(t) {
            var n = e[t];
            !n && s && (n = 2 == e.length ? function (n) {
                e(t, n);
            } : e), a[t] = n && function (e) {
                    n("[xmldom " + t + "]	" + e + r(i));
                } || function () {
                };
        }

        if (!e) {
            if (t instanceof n) return t;
            e = t;
        }
        var a = {}, s = e instanceof Function;
        return i = i || {}, o("warning"), o("error"), o("fatalError"), a;
    }

    function n() {
        this.cdata = !1;
    }

    function i(e, t) {
        t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber;
    }

    function r(e) {
        return e ? "\n@" + (e.systemId || "") + "#[line:" + e.lineNumber + ",col:" + e.columnNumber + "]" : void 0;
    }

    function o(e, t, n) {
        return "string" == typeof e ? e.substr(t, n) : e.length >= t + n || t ? new java.lang.String(e, t, n) + "" : e;
    }

    function a(e, t) {
        e.currentElement ? e.currentElement.appendChild(t) : e.document.appendChild(t);
    }

    var s = function () {
            function e(e, t) {
                for (var n in e) t[n] = e[n];
            }

            function t(t, n) {
                function i() {
                }

                var r = t.prototype;
                if (Object.create) {
                    var o = Object.create(n.prototype);
                    r.__proto__ = o;
                }
                r instanceof n || (i.prototype = n.prototype, i = new i(), e(r, i), t.prototype = r = i),
                r.constructor != t && ("function" != typeof t && console.error("unknow Class:" + t),
                    r.constructor = t);
            }

            function n(e, t) {
                if (t instanceof Error) var i = t; else i = this, Error.call(this, ee[e]), this.message = ee[e],
                Error.captureStackTrace && Error.captureStackTrace(this, n);
                return i.code = e, t && (this.message = this.message + ": " + t), i;
            }

            function i() {
            }

            function r(e, t) {
                this._node = e, this._refresh = t, o(this);
            }

            function o(t) {
                var n = t._node._inc || t._node.ownerDocument._inc;
                if (t._inc != n) {
                    var i = t._refresh(t._node);
                    V(t, "length", i.length), e(i, t), t._inc = n;
                }
            }

            function a() {
            }

            function s(e, t) {
                for (var n = e.length; n--;) if (e[n] === t) return n;
            }

            function c(e, t, n, i) {
                if (i ? t[s(t, i)] = n : t[t.length++] = n, e) {
                    n.ownerElement = e;
                    var r = e.ownerDocument;
                    r && (i && g(r, e, i), v(r, e, n));
                }
            }

            function u(e, t, i) {
                var r = s(t, i);
                if (!(r >= 0)) throw n(te, new Error());
                for (var o = t.length - 1; o > r;) t[r] = t[++r];
                if (t.length = o, e) {
                    var a = e.ownerDocument;
                    a && (g(a, e, i), i.ownerElement = null);
                }
            }

            function l(e) {
                if (this._features = {}, e) for (var t in e) this._features = e[t];
            }

            function h() {
            }

            function p(e) {
                return "<" == e && "&lt;" || ">" == e && "&gt;" || "&" == e && "&amp;" || '"' == e && "&quot;" || "&#" + e.charCodeAt() + ";";
            }

            function d(e, t) {
                if (t(e)) return !0;
                if (e = e.firstChild) do if (d(e, t)) return !0; while (e = e.nextSibling);
            }

            function f() {
            }

            function v(e, t, n) {
                e && e._inc++;
                var i = n.namespaceURI;
                "http://www.w3.org/2000/xmlns/" == i && (t._nsMap[n.prefix ? n.localName : ""] = n.value);
            }

            function g(e, t, n, i) {
                e && e._inc++;
                var r = n.namespaceURI;
                "http://www.w3.org/2000/xmlns/" == r && delete t._nsMap[n.prefix ? n.localName : ""];
            }

            function _(e, t, n) {
                if (e && e._inc) {
                    e._inc++;
                    var i = t.childNodes;
                    if (n) i[i.length++] = n; else {
                        for (var r = t.firstChild, o = 0; r;) i[o++] = r, r = r.nextSibling;
                        i.length = o;
                    }
                }
            }

            function m(e, t) {
                var n = t.previousSibling, i = t.nextSibling;
                return n ? n.nextSibling = i : e.firstChild = i, i ? i.previousSibling = n : e.lastChild = n,
                    _(e.ownerDocument, e), t;
            }

            function y(e, t, n) {
                var i = t.parentNode;
                if (i && i.removeChild(t), t.nodeType === X) {
                    var r = t.firstChild;
                    if (null == r) return t;
                    var o = t.lastChild;
                } else r = o = t;
                var a = n ? n.previousSibling : e.lastChild;
                r.previousSibling = a, o.nextSibling = n, a ? a.nextSibling = r : e.firstChild = r,
                    null == n ? e.lastChild = o : n.previousSibling = o;
                do r.parentNode = e; while (r !== o && (r = r.nextSibling));
                return _(e.ownerDocument || e, e), t.nodeType == X && (t.firstChild = t.lastChild = null),
                    t;
            }

            function E(e, t) {
                var n = t.parentNode;
                if (n) {
                    var i = e.lastChild;
                    n.removeChild(t);
                    var i = e.lastChild;
                }
                var i = e.lastChild;
                return t.parentNode = e, t.previousSibling = i, t.nextSibling = null, i ? i.nextSibling = t : e.firstChild = t,
                    e.lastChild = t, _(e.ownerDocument, e, t), t;
            }

            function S() {
                this._nsMap = {};
            }

            function I() {
            }

            function C() {
            }

            function A() {
            }

            function b() {
            }

            function O() {
            }

            function T() {
            }

            function w() {
            }

            function N() {
            }

            function R() {
            }

            function D() {
            }

            function k() {
            }

            function P() {
            }

            function B(e, t, n, i) {
                switch (e.nodeType) {
                    case W:
                        var r = e.attributes, o = r.length, a = e.firstChild, s = e.tagName;
                        i = F === e.namespaceURI || i, t.push("<", s), n && t.sort.apply(r, n);
                        for (var c = 0; o > c; c++) B(r.item(c), t, n, i);
                        if (a || i && !/^(?:meta|link|img|br|hr|input|button)$/i.test(s)) {
                            if (t.push(">"), i && /^script$/i.test(s)) a && t.push(a.data); else for (; a;) B(a, t, n, i),
                                a = a.nextSibling;
                            t.push("</", s, ">");
                        } else t.push("/>");
                        return;

                    case Q:
                    case X:
                        for (var a = e.firstChild; a;) B(a, t, n, i), a = a.nextSibling;
                        return;

                    case q:
                        return t.push(" ", e.name, '="', e.value.replace(/[<&"]/g, p), '"');

                    case K:
                        return t.push(e.data.replace(/[<&]/g, p));

                    case H:
                        return t.push("<![CDATA[", e.data, "]]>");

                    case z:
                        return t.push("<!--", e.data, "-->");

                    case J:
                        var u = e.publicId, l = e.systemId;
                        if (t.push("<!DOCTYPE ", e.name), u) t.push(' PUBLIC "', u), l && "." != l && t.push('" "', l),
                            t.push('">'); else if (l && "." != l) t.push(' SYSTEM "', l, '">'); else {
                            var h = e.internalSubset;
                            h && t.push(" [", h, "]"), t.push(">");
                        }
                        return;

                    case Y:
                        return t.push("<?", e.target, " ", e.data, "?>");

                    case j:
                        return t.push("&", e.nodeName, ";");

                    default:
                        t.push("??", e.nodeName);
                }
            }

            function L(e, t, n) {
                var i;
                switch (t.nodeType) {
                    case W:
                        i = t.cloneNode(!1), i.ownerDocument = e;

                    case X:
                        break;

                    case q:
                        n = !0;
                }
                if (i || (i = t.cloneNode(!1)), i.ownerDocument = e, i.parentNode = null, n) for (var r = t.firstChild; r;) i.appendChild(L(e, r, n)),
                    r = r.nextSibling;
                return i;
            }

            function U(e, t, n) {
                var r = new t.constructor();
                for (var o in t) {
                    var s = t[o];
                    "object" != typeof s && s != r[o] && (r[o] = s);
                }
                switch (t.childNodes && (r.childNodes = new i()), r.ownerDocument = e, r.nodeType) {
                    case W:
                        var c = t.attributes, u = r.attributes = new a(), l = c.length;
                        u._ownerElement = r;
                        for (var h = 0; l > h; h++) r.setAttributeNode(U(e, c.item(h), !0));
                        break;

                    case q:
                        n = !0;
                }
                if (n) for (var p = t.firstChild; p;) r.appendChild(U(e, p, n)), p = p.nextSibling;
                return r;
            }

            function V(e, t, n) {
                e[t] = n;
            }

            function M(e) {
                switch (e.nodeType) {
                    case 1:
                    case 11:
                        var t = [];
                        for (e = e.firstChild; e;) 7 !== e.nodeType && 8 !== e.nodeType && t.push(M(e)),
                            e = e.nextSibling;
                        return t.join("");

                    default:
                        return e.nodeValue;
                }
            }

            var F = "http://www.w3.org/1999/xhtml",
                x = {},
                W = x.ELEMENT_NODE = 1,
                q = x.ATTRIBUTE_NODE = 2,
                K = x.TEXT_NODE = 3,
                H = x.CDATA_SECTION_NODE = 4,
                j = x.ENTITY_REFERENCE_NODE = 5,
                G = x.ENTITY_NODE = 6,
                Y = x.PROCESSING_INSTRUCTION_NODE = 7,
                z = x.COMMENT_NODE = 8,
                Q = x.DOCUMENT_NODE = 9,
                J = x.DOCUMENT_TYPE_NODE = 10,
                X = x.DOCUMENT_FRAGMENT_NODE = 11,
                $ = x.NOTATION_NODE = 12,
                Z = {},
                ee = {},
                te = (Z.INDEX_SIZE_ERR = (ee[1] = "Index size error",
                    1), Z.DOMSTRING_SIZE_ERR = (ee[2] = "DOMString size error", 2), Z.HIERARCHY_REQUEST_ERR = (ee[3] = "Hierarchy request error",
                    3), Z.WRONG_DOCUMENT_ERR = (ee[4] = "Wrong document", 4), Z.INVALID_CHARACTER_ERR = (ee[5] = "Invalid character",
                    5), Z.NO_DATA_ALLOWED_ERR = (ee[6] = "No data allowed", 6), Z.NO_MODIFICATION_ALLOWED_ERR = (ee[7] = "No modification allowed",
                    7), Z.NOT_FOUND_ERR = (ee[8] = "Not found", 8)),
                ne = (Z.NOT_SUPPORTED_ERR = (ee[9] = "Not supported",
                    9), Z.INUSE_ATTRIBUTE_ERR = (ee[10] = "Attribute in use", 10));

            Z.INVALID_STATE_ERR = (ee[11] = "Invalid state", 11);
            Z.SYNTAX_ERR = (ee[12] = "Syntax error", 12);
            Z.INVALID_MODIFICATION_ERR = (ee[13] = "Invalid modification", 13);
            Z.NAMESPACE_ERR = (ee[14] = "Invalid namespace", 14);
            Z.INVALID_ACCESS_ERR = (ee[15] = "Invalid access", 15);

            n.prototype = Error.prototype;
            e(Z, n);
            i.prototype = {
                length: 0,
                item: function (e) {
                    return this[e] || null;
                },
                toString: function () {
                    for (var e = [], t = 0; t < this.length; t++) B(this[t], e);
                    return e.join("");
                }
            };
            r.prototype.item = function (e) {
                return o(this), this[e];
            };
            t(r, i);
            a.prototype = {
                length: 0,
                item: i.prototype.item,
                getNamedItem: function (e) {
                    for (var t = this.length; t--;) {
                        var n = this[t];
                        if (n.nodeName == e) return n;
                    }
                },
                setNamedItem: function (e) {
                    var t = e.ownerElement;
                    if (t && t != this._ownerElement) throw new n(ne);
                    var i = this.getNamedItem(e.nodeName);
                    return c(this._ownerElement, this, e, i), i;
                },
                setNamedItemNS: function (e) {
                    var t, i = e.ownerElement;
                    if (i && i != this._ownerElement) throw new n(ne);
                    return t = this.getNamedItemNS(e.namespaceURI, e.localName), c(this._ownerElement, this, e, t),
                        t;
                },
                removeNamedItem: function (e) {
                    var t = this.getNamedItem(e);
                    return u(this._ownerElement, this, t), t;
                },
                removeNamedItemNS: function (e, t) {
                    var n = this.getNamedItemNS(e, t);
                    return u(this._ownerElement, this, n), n;
                },
                getNamedItemNS: function (e, t) {
                    for (var n = this.length; n--;) {
                        var i = this[n];
                        if (i.localName == t && i.namespaceURI == e) return i;
                    }
                    return null;
                }
            };
            l.prototype = {
                hasFeature: function (e, t) {
                    var n = this._features[e.toLowerCase()];
                    return n && (!t || t in n) ? !0 : !1;
                },
                createDocument: function (e, t, n) {
                    var r = new f();
                    if (r.implementation = this, r.childNodes = new i(), r.doctype = n, n && r.appendChild(n),
                            t) {
                        var o = r.createElementNS(e, t);
                        r.appendChild(o);
                    }
                    return r;
                },
                createDocumentType: function (e, t, n) {
                    var i = new T();
                    return i.name = e, i.nodeName = e, i.publicId = t, i.systemId = n, i;
                }
            };
            h.prototype = {
                firstChild: null,
                lastChild: null,
                previousSibling: null,
                nextSibling: null,
                attributes: null,
                parentNode: null,
                childNodes: null,
                ownerDocument: null,
                nodeValue: null,
                namespaceURI: null,
                prefix: null,
                localName: null,
                insertBefore: function (e, t) {
                    return y(this, e, t);
                },
                replaceChild: function (e, t) {
                    this.insertBefore(e, t), t && this.removeChild(t);
                },
                removeChild: function (e) {
                    return m(this, e);
                },
                appendChild: function (e) {
                    return this.insertBefore(e, null);
                },
                hasChildNodes: function () {
                    return null != this.firstChild;
                },
                cloneNode: function (e) {
                    return U(this.ownerDocument || this, this, e);
                },
                normalize: function () {
                    for (var e = this.firstChild; e;) {
                        var t = e.nextSibling;
                        t && t.nodeType == K && e.nodeType == K ? (this.removeChild(t), e.appendData(t.data)) : (e.normalize(),
                            e = t);
                    }
                },
                isSupported: function (e, t) {
                    return this.ownerDocument.implementation.hasFeature(e, t);
                },
                hasAttributes: function () {
                    return this.attributes.length > 0;
                },
                lookupPrefix: function (e) {
                    for (var t = this; t;) {
                        var n = t._nsMap;
                        if (n) for (var i in n) if (n[i] == e) return i;
                        t = 2 == t.nodeType ? t.ownerDocument : t.parentNode;
                    }
                    return null;
                },
                lookupNamespaceURI: function (e) {
                    for (var t = this; t;) {
                        var n = t._nsMap;
                        if (n && e in n) return n[e];
                        t = 2 == t.nodeType ? t.ownerDocument : t.parentNode;
                    }
                    return null;
                },
                isDefaultNamespace: function (e) {
                    var t = this.lookupPrefix(e);
                    return null == t;
                }
            };
            e(x, h);
            e(x, h.prototype);

            f.prototype = {
                nodeName: "#document",
                nodeType: Q,
                doctype: null,
                documentElement: null,
                _inc: 1,
                insertBefore: function (e, t) {
                    if (e.nodeType == X) {
                        for (var n = e.firstChild; n;) {
                            var i = n.nextSibling;
                            this.insertBefore(n, t), n = i;
                        }
                        return e;
                    }
                    return null == this.documentElement && 1 == e.nodeType && (this.documentElement = e),
                        y(this, e, t), e.ownerDocument = this, e;
                },
                removeChild: function (e) {
                    return this.documentElement == e && (this.documentElement = null), m(this, e);
                },
                importNode: function (e, t) {
                    return L(this, e, t);
                },
                getElementById: function (e) {
                    var t = null;
                    return d(this.documentElement, function (n) {
                        return 1 == n.nodeType && n.getAttribute("id") == e ? (t = n, !0) : void 0;
                    }), t;
                },
                createElement: function (e) {
                    var t = new S();
                    t.ownerDocument = this, t.nodeName = e, t.tagName = e, t.childNodes = new i();
                    var n = t.attributes = new a();
                    return n._ownerElement = t, t;
                },
                createDocumentFragment: function () {
                    var e = new D();
                    return e.ownerDocument = this, e.childNodes = new i(), e;
                },
                createTextNode: function (e) {
                    var t = new A();
                    return t.ownerDocument = this, t.appendData(e), t;
                },
                createComment: function (e) {
                    var t = new b();
                    return t.ownerDocument = this, t.appendData(e), t;
                },
                createCDATASection: function (e) {
                    var t = new O();
                    return t.ownerDocument = this, t.appendData(e), t;
                },
                createProcessingInstruction: function (e, t) {
                    var n = new k();
                    return n.ownerDocument = this, n.tagName = n.target = e, n.nodeValue = n.data = t,
                        n;
                },
                createAttribute: function (e) {
                    var t = new I();
                    return t.ownerDocument = this, t.name = e, t.nodeName = e, t.localName = e, t.specified = !0,
                        t;
                },
                createEntityReference: function (e) {
                    var t = new R();
                    return t.ownerDocument = this, t.nodeName = e, t;
                },
                createElementNS: function (e, t) {
                    var n = new S(), r = t.split(":"), o = n.attributes = new a();
                    return n.childNodes = new i(), n.ownerDocument = this, n.nodeName = t, n.tagName = t,
                        n.namespaceURI = e, 2 == r.length ? (n.prefix = r[0], n.localName = r[1]) : n.localName = t,
                        o._ownerElement = n, n;
                },
                createAttributeNS: function (e, t) {
                    var n = new I(), i = t.split(":");
                    return n.ownerDocument = this, n.nodeName = t, n.name = t, n.namespaceURI = e, n.specified = !0,
                        2 == i.length ? (n.prefix = i[0], n.localName = i[1]) : n.localName = t, n;
                }
            };
            t(f, h);

            S.prototype = {
                nodeType: W,
                hasAttribute: function (e) {
                    return null != this.getAttributeNode(e);
                },
                getAttribute: function (e) {
                    var t = this.getAttributeNode(e);
                    return t && t.value || "";
                },
                getAttributeNode: function (e) {
                    return this.attributes.getNamedItem(e);
                },
                setAttribute: function (e, t) {
                    var n = this.ownerDocument.createAttribute(e);
                    n.value = n.nodeValue = "" + t, this.setAttributeNode(n);
                },
                removeAttribute: function (e) {
                    var t = this.getAttributeNode(e);
                    t && this.removeAttributeNode(t);
                },
                appendChild: function (e) {
                    return e.nodeType === X ? this.insertBefore(e, null) : E(this, e);
                },
                setAttributeNode: function (e) {
                    return this.attributes.setNamedItem(e);
                },
                setAttributeNodeNS: function (e) {
                    return this.attributes.setNamedItemNS(e);
                },
                removeAttributeNode: function (e) {
                    return this.attributes.removeNamedItem(e.nodeName);
                },
                removeAttributeNS: function (e, t) {
                    var n = this.getAttributeNodeNS(e, t);
                    n && this.removeAttributeNode(n);
                },
                hasAttributeNS: function (e, t) {
                    return null != this.getAttributeNodeNS(e, t);
                },
                getAttributeNS: function (e, t) {
                    var n = this.getAttributeNodeNS(e, t);
                    return n && n.value || "";
                },
                setAttributeNS: function (e, t, n) {
                    var i = this.ownerDocument.createAttributeNS(e, t);
                    i.value = i.nodeValue = "" + n, this.setAttributeNode(i);
                },
                getAttributeNodeNS: function (e, t) {
                    return this.attributes.getNamedItemNS(e, t);
                },
                getElementsByTagName: function (e) {
                    return new r(this, function (t) {
                        var n = [];
                        return d(t, function (i) {
                            i === t || i.nodeType != W || "*" !== e && i.tagName != e || n.push(i);
                        }), n;
                    });
                },
                getElementsByTagNameNS: function (e, t) {
                    return new r(this, function (n) {
                        var i = [];
                        return d(n, function (r) {
                            r === n || r.nodeType !== W || "*" !== e && r.namespaceURI !== e || "*" !== t && r.localName != t || i.push(r);
                        }), i;
                    });
                }
            };

            f.prototype.getElementsByTagName = S.prototype.getElementsByTagName, f.prototype.getElementsByTagNameNS = S.prototype.getElementsByTagNameNS,
                t(S, h), I.prototype.nodeType = q, t(I, h), C.prototype = {
                data: "",
                substringData: function (e, t) {
                    return this.data.substring(e, e + t);
                },
                appendData: function (e) {
                    e = this.data + e, this.nodeValue = this.data = e, this.length = e.length;
                },
                insertData: function (e, t) {
                    this.replaceData(e, 0, t);
                },
                appendChild: function (e) {
                    throw new Error(ee[3]);
                },
                deleteData: function (e, t) {
                    this.replaceData(e, t, "");
                },
                replaceData: function (e, t, n) {
                    var i = this.data.substring(0, e), r = this.data.substring(e + t);
                    n = i + n + r, this.nodeValue = this.data = n, this.length = n.length;
                }
            };
            t(C, h);

            A.prototype = {
                nodeName: "#text",
                nodeType: K,
                splitText: function (e) {
                    var t = this.data, n = t.substring(e);
                    t = t.substring(0, e), this.data = this.nodeValue = t, this.length = t.length;
                    var i = this.ownerDocument.createTextNode(n);
                    return this.parentNode && this.parentNode.insertBefore(i, this.nextSibling), i;
                }
            };
            t(A, C);

            b.prototype = {
                nodeName: "#comment",
                nodeType: z
            };
            t(b, C);

            O.prototype = {
                nodeName: "#cdata-section",
                nodeType: H
            };
            t(O, C);

            T.prototype.nodeType = J;
            t(T, h);

            w.prototype.nodeType = $;
            t(w, h);

            N.prototype.nodeType = G;
            t(N, h);

            R.prototype.nodeType = j;
            t(R, h);

            D.prototype.nodeName = "#document-fragment";
            D.prototype.nodeType = X;
            t(D, h);

            k.prototype.nodeType = Y;
            t(k, h);

            P.prototype.serializeToString = function (e, t) {
                return e.toString(t);
            };

            h.prototype.toString = function (e) {
                var t = [];
                B(this, t, e);
                return t.join("");
            };

            try {
                if(Object.defineProperty){
                    Object.defineProperty(r.prototype, "length", {
                        get: function () {
                            return o(this), this.$length;
                        }
                    });
                    Object.defineProperty(h.prototype, "textContent", {
                        get: function () {
                            return M(this);
                        },
                        set: function (e) {
                            switch (this.nodeType) {
                                case 1:
                                case 11:
                                    for (; this.firstChild;) this.removeChild(this.firstChild);
                                    (e || String(e)) && this.appendChild(this.ownerDocument.createTextNode(e));
                                    break;

                                default:
                                    this.data = e, this.value = value, this.nodeValue = e;
                            }
                        }
                    });
                    V = function (e, t, n) {
                        e["$" + t] = n;
                    };
                }
            } catch (ie) {
            }
            var re = {
                DOMImplementation: l,
                XMLSerializer: P
            };
            return re;
        },

        c = function () {
            function e(e, a, l, h, p) {
                function d(e) {
                    if (e > 65535) {
                        e -= 65536;
                        var t = 55296 + (e >> 10), n = 56320 + (1023 & e);
                        return String.fromCharCode(t, n);
                    }
                    return String.fromCharCode(e);
                }

                function f(e) {
                    var t = e.slice(1, -1);
                    return t in l ? l[t] : "#" === t.charAt(0) ? d(parseInt(t.substr(1).replace("x", "0x"))) : (p.error("entity not found:" + e),
                        e);
                }

                function v(t) {
                    if (t > C) {
                        var n = e.substring(C, t).replace(/&#?\w+;/g, f);
                        E && g(C), h.characters(n, 0, t - C), C = t;
                    }
                }

                function g(t, n) {
                    for (; t >= m && (n = y.exec(e));) _ = n.index, m = _ + n[0].length, E.lineNumber++;
                    E.columnNumber = t - _ + 1;
                }

                for (var _ = 0, m = 0, y = /.+(?:\r\n?|\n)|.*$/g, E = h.locator, S = [{
                    currentNSMap: a
                }], I = {}, C = 0; ;) {
                    try {
                        var A = e.indexOf("<", C);
                        if (0 > A) {
                            if (!e.substr(C).match(/^\s*$/)) {
                                var b = h.document, O = b.createTextNode(e.substr(C));
                                b.appendChild(O), h.currentElement = O;
                            }
                            return;
                        }
                        switch (A > C && v(A), e.charAt(A + 1)) {
                            case "/":
                                var T = e.indexOf(">", A + 3), w = e.substring(A + 2, T), N = S.pop(), R = N.localNSMap;
                                if (N.tagName != w && p.fatalError("end tag name: " + w + " is not match the current start tagName:" + N.tagName),
                                        h.endElement(N.uri, N.localName, w), R) for (var D in R) h.endPrefixMapping(D);
                                T++;
                                break;

                            case "?":
                                E && g(A), T = c(e, A, h);
                                break;

                            case "!":
                                E && g(A), T = s(e, A, h, p);
                                break;

                            default:
                                E && g(A);
                                var k = new u(), T = n(e, A, k, f, p), P = k.length;
                                if (E) {
                                    if (P) for (var B = 0; P > B; B++) {
                                        var L = k[B];
                                        g(L.offset), L.offset = t(E, {});
                                    }
                                    g(T);
                                }
                                !k.closed && o(e, T, k.tagName, I) && (k.closed = !0, l.nbsp || p.warning("unclosed xml attribute")),
                                    i(k, h, S), "http://www.w3.org/1999/xhtml" !== k.uri || k.closed ? T++ : T = r(e, T, k.tagName, f, h);
                        }
                    } catch (U) {
                        p.error("element parse error: " + U), T = -1;
                    }
                    T > C ? C = T : v(Math.max(A, C) + 1);
                }
            }

            function t(e, t) {
                return t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber, t;
            }

            function n(e, t, n, i, r) {
                for (var o, a, s = ++t, c = v; ;) {
                    var u = e.charAt(s);
                    switch (u) {
                        case "=":
                            if (c === g) o = e.slice(t, s), c = m; else {
                                if (c !== _) throw new Error("attribute equal must after attrName");
                                c = m;
                            }
                            break;

                        case "'":
                        case '"':
                            if (c === m) {
                                if (t = s + 1, s = e.indexOf(u, t), !(s > 0)) throw new Error("attribute value no end '" + u + "' match");
                                a = e.slice(t, s).replace(/&#?\w+;/g, i), n.add(o, a, t - 1), c = E;
                            } else {
                                if (c != y) throw new Error('attribute value must after "="');
                                a = e.slice(t, s).replace(/&#?\w+;/g, i), n.add(o, a, t), r.warning('attribute "' + o + '" missed start quot(' + u + ")!!"),
                                    t = s + 1, c = E;
                            }
                            break;

                        case "/":
                            switch (c) {
                                case v:
                                    n.setTagName(e.slice(t, s));

                                case E:
                                case S:
                                case I:
                                    c = I, n.closed = !0;

                                case y:
                                case g:
                                case _:
                                    break;

                                default:
                                    throw new Error("attribute invalid close char('/')");
                            }
                            break;

                        case "":
                            r.error("unexpected end of input");

                        case ">":
                            switch (c) {
                                case v:
                                    n.setTagName(e.slice(t, s));

                                case E:
                                case S:
                                case I:
                                    break;

                                case y:
                                case g:
                                    a = e.slice(t, s), "/" === a.slice(-1) && (n.closed = !0, a = a.slice(0, -1));

                                case _:
                                    c === _ && (a = o), c == y ? (r.warning('attribute "' + a + '" missed quot(")!!'),
                                        n.add(o, a.replace(/&#?\w+;/g, i), t)) : (r.warning('attribute "' + a + '" missed value!! "' + a + '" instead!!'),
                                        n.add(a, a, t));
                                    break;

                                case m:
                                    throw new Error("attribute value missed!!");
                            }
                            return s;

                        case "?":
                            u = " ";

                        default:
                            if (" " >= u) switch (c) {
                                case v:
                                    n.setTagName(e.slice(t, s)), c = S;
                                    break;

                                case g:
                                    o = e.slice(t, s), c = _;
                                    break;

                                case y:
                                    var a = e.slice(t, s).replace(/&#?\w+;/g, i);
                                    r.warning('attribute "' + a + '" missed quot(")!!'), n.add(o, a, t);

                                case E:
                                    c = S;
                            } else switch (c) {
                                case _:
                                    r.warning('attribute "' + o + '" missed value!! "' + o + '" instead!!'), n.add(o, o, t),
                                        t = s, c = g;
                                    break;

                                case E:
                                    r.warning('attribute space is required"' + o + '"!!');

                                case S:
                                    c = g, t = s;
                                    break;

                                case m:
                                    c = y, t = s;
                                    break;

                                case I:
                                    throw new Error("elements closed character '/' and '>' must be connected to");
                            }
                    }
                    s++;
                }
            }

            function i(e, t, n) {
                for (var i = e.tagName, r = null, o = n[n.length - 1].currentNSMap, s = e.length; s--;) {
                    var c = e[s], u = c.qName, l = c.value, h = u.indexOf(":");
                    if (h > 0) var p = c.prefix = u.slice(0, h), d = u.slice(h + 1), f = "xmlns" === p && d; else d = u,
                        p = null, f = "xmlns" === u && "";
                    c.localName = d, f !== !1 && (null == r && (r = {}, a(o, o = {})), o[f] = r[f] = l,
                        c.uri = "http://www.w3.org/2000/xmlns/", t.startPrefixMapping(f, l));
                }
                for (var s = e.length; s--;) {
                    c = e[s];
                    var p = c.prefix;
                    p && ("xml" === p && (c.uri = "http://www.w3.org/XML/1998/namespace"), "xmlns" !== p && (c.uri = o[p]));
                }
                var h = i.indexOf(":");
                h > 0 ? (p = e.prefix = i.slice(0, h), d = e.localName = i.slice(h + 1)) : (p = null,
                    d = e.localName = i);
                var v = e.uri = o[p || ""];
                if (t.startElement(v, d, i, e), e.closed) {
                    if (t.endElement(v, d, i), r) for (p in r) t.endPrefixMapping(p);
                } else e.currentNSMap = o, e.localNSMap = r, n.push(e);
            }

            function r(e, t, n, i, r) {
                if (/^(?:script|textarea)$/i.test(n)) {
                    var o = e.indexOf("</" + n + ">", t), a = e.substring(t + 1, o);
                    if (/[&<]/.test(a)) return /^script$/i.test(n) ? (r.characters(a, 0, a.length),
                        o) : (a = a.replace(/&#?\w+;/g, i), r.characters(a, 0, a.length), o);
                }
                return t + 1;
            }

            function o(e, t, n, i) {
                var r = i[n];
                return null == r && (r = i[n] = e.lastIndexOf("</" + n + ">")), t > r;
            }

            function a(e, t) {
                for (var n in e) t[n] = e[n];
            }

            function s(e, t, n, i) {
                var r = e.charAt(t + 2);
                switch (r) {
                    case "-":
                        if ("-" === e.charAt(t + 3)) {
                            var o = e.indexOf("-->", t + 4);
                            return o > t ? (n.comment(e, t + 4, o - t - 4), o + 3) : (i.error("Unclosed comment"),
                                -1);
                        }
                        return -1;

                    default:
                        if ("CDATA[" == e.substr(t + 3, 6)) {
                            var o = e.indexOf("]]>", t + 9);
                            return n.startCDATA(), n.characters(e, t + 9, o - t - 9), n.endCDATA(), o + 3;
                        }
                        var a = h(e, t), s = a.length;
                        if (s > 1 && /!doctype/i.test(a[0][0])) {
                            var c = a[1][0], u = s > 3 && /^public$/i.test(a[2][0]) && a[3][0], l = s > 4 && a[4][0], p = a[s - 1];
                            return n.startDTD(c, u && u.replace(/^(['"])(.*?)\1$/, "$2"), l && l.replace(/^(['"])(.*?)\1$/, "$2")),
                                n.endDTD(), p.index + p[0].length;
                        }
                }
                return -1;
            }

            function c(e, t, n) {
                var i = e.indexOf("?>", t);
                if (i) {
                    var r = e.substring(t, i).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
                    if (r) {
                        r[0].length;
                        return n.processingInstruction(r[1], r[2]), i + 2;
                    }
                    return -1;
                }
                return -1;
            }

            function u(e) {
            }

            function l(e, t) {
                return e.__proto__ = t, e;
            }

            function h(e, t) {
                var n, i = [], r = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
                for (r.lastIndex = t, r.exec(e); n = r.exec(e);) if (i.push(n), n[1]) return i;
            }

            var p = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
            var d = new RegExp("[\\-\\.0-9" + p.source.slice(1, -1) + "¡¤?\\-?\\u203F\\-?]");
            var f = new RegExp("^" + p.source + d.source + "*(?::" + p.source + d.source + "*)?$");
            v = 0, g = 1, _ = 2, m = 3, y = 4, E = 5, S = 6, I = 7, C = function () {
            };
            C.prototype = {
                parse: function (t, n, i) {
                    var r = this.domBuilder;
                    r.startDocument(), a(n, n = {}), e(t, n, i, r, this.errorHandler), r.endDocument();
                }
            }, u.prototype = {
                setTagName: function (e) {
                    if (!f.test(e)) throw new Error("invalid tagName:" + e);
                    this.tagName = e;
                },
                add: function (e, t, n) {
                    if (!f.test(e)) throw new Error("invalid attribute:" + e);
                    this[this.length++] = {
                        qName: e,
                        value: t,
                        offset: n
                    };
                },
                length: 0,
                getLocalName: function (e) {
                    return this[e].localName;
                },
                getOffset: function (e) {
                    return this[e].offset;
                },
                getQName: function (e) {
                    return this[e].qName;
                },
                getURI: function (e) {
                    return this[e].uri;
                },
                getValue: function (e) {
                    return this[e].value;
                }
            }, l({}, l.prototype) instanceof l || (l = function (e, t) {
                function n() {
                }

                n.prototype = t, n = new n();
                for (t in e) n[t] = e[t];
                return n;
            });
            var A = {
                XMLReader: C
            };
            return A;
        }, u = s(), l = c();

    DOMParser.prototype.parseFromString = function (e, i) {
        var r = this.options, o = new l.XMLReader(), a = r.domBuilder || new n(), s = r.errorHandler, c = r.locator, u = r.xmlns || {}, h = {
            lt: "<",
            gt: ">",
            amp: "&",
            quot: '"',
            apos: "'"
        };
        return c && a.setDocumentLocator(c), o.errorHandler = t(s, a, c), o.domBuilder = r.domBuilder || a,
        /\/x?html?$/.test(i) && (h.nbsp = "?", h.copy = "?", u[""] = "http://www.w3.org/1999/xhtml"),
            u.xml = u.xml || "http://www.w3.org/XML/1998/namespace", e ? o.parse(e, u, h) : o.errorHandler.error("invalid document source"),
            a.document;
    };

    n.prototype = {
        startDocument: function () {
            this.document = new u.DOMImplementation().createDocument(null, null, null), this.locator && (this.document.documentURI = this.locator.systemId);
        },
        startElement: function (e, t, n, r) {
            var o = this.document, s = o.createElementNS(e, n || t), c = r.length;
            a(this, s), this.currentElement = s, this.locator && i(this.locator, s);
            for (var u = 0; c > u; u++) {
                var e = r.getURI(u), l = r.getValue(u), n = r.getQName(u), h = o.createAttributeNS(e, n);
                h.getOffset && i(h.getOffset(1), h), h.value = h.nodeValue = l, s.setAttributeNode(h);
            }
        },
        endElement: function (e, t, n) {
            var i = this.currentElement;
            i.tagName;
            this.currentElement = i.parentNode;
        },
        startPrefixMapping: function (e, t) {
        },
        endPrefixMapping: function (e) {
        },
        processingInstruction: function (e, t) {
            var n = this.document.createProcessingInstruction(e, t);
            this.locator && i(this.locator, n), a(this, n);
        },
        ignorableWhitespace: function (e, t, n) {
        },
        characters: function (e, t, n) {
            if (e = o.apply(this, arguments), this.currentElement && e) {
                if (this.cdata) {
                    var r = this.document.createCDATASection(e);
                    this.currentElement.appendChild(r);
                } else {
                    var r = this.document.createTextNode(e);
                    this.currentElement.appendChild(r);
                }
                this.locator && i(this.locator, r);
            }
        },
        skippedEntity: function (e) {
        },
        endDocument: function () {
            this.document.normalize();
        },
        setDocumentLocator: function (e) {
            (this.locator = e) && (e.lineNumber = 0);
        },
        comment: function (e, t, n) {
            e = o.apply(this, arguments);
            var r = this.document.createComment(e);
            this.locator && i(this.locator, r), a(this, r);
        },
        startCDATA: function () {
            this.cdata = !0;
        },
        endCDATA: function () {
            this.cdata = !1;
        },
        startDTD: function (e, t, n) {
            var r = this.document.implementation;
            if (r && r.createDocumentType) {
                var o = r.createDocumentType(e, t, n);
                this.locator && i(this.locator, o), a(this, o);
            }
        },
        warning: function (e) {
            console.warn("[xmldom warning]	" + e, r(this.locator));
        },
        error: function (e) {
            console.error("[xmldom error]	" + e, r(this.locator));
        },
        fatalError: function (e) {
            throw console.error("[xmldom fatalError]	" + e, r(this.locator)), e;
        }
    };

    "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function (e) {
        n.prototype[e] = function () {
            return null;
        };
    });
    return DOMParser;
});


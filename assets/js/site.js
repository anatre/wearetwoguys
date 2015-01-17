var SG;
(function (SG) {
    (function (plugin) {
        var Plugin = (function () {
            function Plugin() {
                console.log('Plugin init done.');
            }
            return Plugin;
        })();
        plugin.Plugin = Plugin;
    })(SG.plugin || (SG.plugin = {}));
    var plugin = SG.plugin;
})(SG || (SG = {}));
var SG;
(function (SG) {
    (function (component) {
        var Component = (function () {
            function Component() {
                console.log('Component.ts init done');
            }
            return Component;
        })();
        component.Component = Component;
    })(SG.component || (SG.component = {}));
    var component = SG.component;
})(SG || (SG = {}));
var ObjectHelper;
(function (ObjectHelper) {
    function getObjectLength(object) {
        var count = 0;
        var i;

        for (i in object) {
            if (object.hasOwnProperty(i)) {
                count++;
            }
        }

        return count;
    }
    ObjectHelper.getObjectLength = getObjectLength;

    function mergeObject(obj1, obj2) {
        var mergedObj = obj1;

        for (var i in obj2) {
            mergedObj[i] = obj2[i];
        }

        return mergedObj;
    }
    ObjectHelper.mergeObject = mergeObject;
})(ObjectHelper || (ObjectHelper = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SG;
(function (SG) {
    (function (component) {
        var HeaderComponent = (function (_super) {
            __extends(HeaderComponent, _super);
            function HeaderComponent() {
                var _this = this;
                _super.call(this);

                $(HeaderComponent.HEADER_MENU_ELEMENTS).unbind('click.headerMenuElementClick').bind('click.headerMenuElementClick', function (e) {
                    _this._onHeaderMenuElementClick(e);
                });

                console.log('HeaderComponent.ts init done');
            }
            HeaderComponent.prototype._onHeaderMenuElementClick = function (e) {
                e.preventDefault();

                var menu = $(e.delegateTarget).attr('id');

                SG.controller.HomeController.ON_PAGE_NAVIGATION.gotoContent(menu);

                return;
            };

            HeaderComponent.SET_ACTIVE_MENU = function (menu) {
                $(HeaderComponent.HEADER_MENU_ACTIVE).removeClass('active');

                $('#' + menu).addClass('active');
            };
            HeaderComponent.HEADER_ELEMENT = '#header';
            HeaderComponent.HEADER_MENU_ELEMENTS = HeaderComponent.HEADER_ELEMENT + ' a';
            HeaderComponent.HEADER_MENU_ACTIVE = HeaderComponent.HEADER_MENU_ELEMENTS + '.active';
            return HeaderComponent;
        })(component.Component);
        component.HeaderComponent = HeaderComponent;
    })(SG.component || (SG.component = {}));
    var component = SG.component;
})(SG || (SG = {}));
var BrowserHelper;
(function (BrowserHelper) {
    function getScrollableElement() {
        var isWebkit = (jQuery.browser.webkit);

        return isWebkit ? "body" : "html";
    }
    BrowserHelper.getScrollableElement = getScrollableElement;

    function isCanvasSupport() {
        var el = $('<canvas></canvas>')[0], hasGetContext = (el.getContext == undefined) ? false : true;

        return hasGetContext;
    }
    BrowserHelper.isCanvasSupport = isCanvasSupport;

    function isIE() {
        return (jQuery.browser.msie) ? true : false;
    }
    BrowserHelper.isIE = isIE;

    function isIE7() {
        return (this.isIE() && jQuery.browser.version == '7.0') ? true : false;
    }
    BrowserHelper.isIE7 = isIE7;
})(BrowserHelper || (BrowserHelper = {}));
var SG;
(function (SG) {
    (function (plugin) {
        var OnPageNavigationPlugin = (function (_super) {
            __extends(OnPageNavigationPlugin, _super);
            function OnPageNavigationPlugin(config) {
                var _this = this;
                _super.call(this);
                this._scrolling = false;
                this._actualContent = OnPageNavigationPlugin.MENU_HOME;
                this._actualScrollPosition = 0;
                this._menuPairs = {
                    'menu_home': { topPos: 0, bottomPos: 0, centerPos: 0, elementSelector: '#hire_container' },
                    'menu_references': { topPos: 0, bottomPos: 0, centerPos: 0, elementSelector: '#content_references' },
                    'menu_skills': { topPos: 0, bottomPos: 0, centerPos: 0, elementSelector: '#content_skills' },
                    'menu_contact': { topPos: 0, bottomPos: 0, centerPos: 0, elementSelector: '#content_contact' }
                };
                this.navigateOnMouseWheel = true;

                if (config) {
                    this.navigateOnMouseWheel = config.navigateOnMouseWheel;
                }

                this._actualScrollPosition = $(document).scrollTop();

                this._setContentPositions();
                this._checkActualContent();

                $(window).unbind('mousewheel.onPageNavigationMouseWheel MozMousePixelScroll.onPageNavigationMouseWheel').bind('mousewheel.onPageNavigationMouseWheel MozMousePixelScroll.onPageNavigationMouseWheel', function (e) {
                    _this._onWindowMouseWheel(e);
                });

                $(window).unbind('scroll.onPageNavigationScroll').bind('scroll.onPageNavigationScroll', function (e) {
                    _this._onWindowScroll(e);
                });

                $(window).unbind('resize.onPageNavigationResize').bind('resize.onPageNavigationResize', function (e) {
                    _this._onWindowResize(e);
                });

                console.log('OnPageNavigation init done.');
            }
            OnPageNavigationPlugin.prototype.kill = function () {
                $(window).unbind('mousewheel.onPageNavigationMouseWheel');

                $(window).unbind('scroll.onPageNavigationScroll');

                $(window).unbind('resize.onPageNavigationResize');
            };

            OnPageNavigationPlugin.prototype._onWindowResize = function (e) {
                this._setContentPositions();
            };

            OnPageNavigationPlugin.prototype._onWindowScroll = function (e) {
                var direction, prevPosition = this._actualScrollPosition, currentPosition = $(document).scrollTop();

                this._actualScrollPosition = currentPosition;

                this._checkActualContent();
            };

            OnPageNavigationPlugin.prototype._onWindowMouseWheel = function (e) {
                if (this.navigateOnMouseWheel == false) {
                    return;
                }

                e.preventDefault();

                if (this._scrolling == true) {
                    return;
                }

                this._scrolling = true;

                var up = (e.originalEvent.wheelDelta !== undefined) ? e.originalEvent.wheelDelta / 120 > 0 : e.originalEvent.detail < 0;

                if (up) {
                    this._gotoPrevContent();
                } else {
                    this._gotoNextContent();
                }

                return;
            };

            OnPageNavigationPlugin.prototype.gotoContent = function (where, callback) {
                var _this = this;
                var content = this._menuPairs[where];

                if (content != undefined) {
                    setTimeout(function () {
                        var animateTopPos = content['topPos'], animateElSel = BrowserHelper.getScrollableElement();

                        $(animateElSel).animate({
                            scrollTop: animateTopPos
                        }, {
                            duration: 500,
                            easing: 'easeInOutCirc',
                            complete: function () {
                                _this._onGotoContentAnimateDone(where);

                                SG.component.HeaderComponent.SET_ACTIVE_MENU(where);

                                $(window).trigger(OnPageNavigationPlugin.EVENT_PAGE_NAVIGATION_DONE, [{ menu: where }]);

                                if (callback != undefined) {
                                    callback();
                                }
                            }
                        });
                    }, 100);
                } else {
                    console.error('Nem talalhato element: ', where);
                }
            };

            OnPageNavigationPlugin.prototype._onGotoContentAnimateDone = function (actualElement) {
                this._scrolling = false;
                this._actualContent = actualElement;
            };

            OnPageNavigationPlugin.prototype._gotoPrevContent = function () {
                var actualElementIndex = this._getElementIndex(this._actualContent);

                if (actualElementIndex != 0) {
                    this.gotoContent(this._getKeyByIndex(actualElementIndex - 1));
                } else {
                    this._scrolling = false;
                }
            };

            OnPageNavigationPlugin.prototype._gotoNextContent = function () {
                var actualElementIndex = this._getElementIndex(this._actualContent);

                if (actualElementIndex != ObjectHelper.getObjectLength(this._menuPairs) - 1) {
                    this.gotoContent(this._getKeyByIndex(actualElementIndex + 1));
                } else {
                    this._scrolling = false;
                }
            };

            OnPageNavigationPlugin.prototype._setContentPositions = function () {
                $.each(this._menuPairs, function (key, value) {
                    var topPos, bottomPos, elCenterPos;

                    var el = $(value['elementSelector']), elTopPos = el.offset().top, elBottomPos = elTopPos + el.outerHeight(), elCenterPos = ((elBottomPos - elTopPos) / 2) + elTopPos;

                    value['topPos'] = elTopPos;
                    value['bottomPos'] = elBottomPos;
                    value['centerPos'] = elCenterPos;
                });
            };

            OnPageNavigationPlugin.prototype._getElementIndex = function (key) {
                var i = 0, index = 0;

                $.each(this._menuPairs, function (objKey) {
                    if (objKey == key) {
                        index = i;
                    }

                    i++;
                });

                return index;
            };

            OnPageNavigationPlugin.prototype._getKeyByIndex = function (index) {
                var i = 0, key = '';

                $.each(this._menuPairs, function (objKey) {
                    if (i == index) {
                        key = objKey;
                    }

                    i++;
                });

                return key;
            };

            OnPageNavigationPlugin.prototype._checkActualContent = function () {
                var _this = this;
                $.each(this._menuPairs, function (key, value) {
                    var contentTopPos = value['topPos'], contentBottomPos = value['bottomPos'], windowCenter = ($(window).height() / 2) + _this._actualScrollPosition;

                    if (windowCenter >= contentTopPos && windowCenter < contentBottomPos) {
                        _this._actualContent = key;
                    }

                    SG.component.HeaderComponent.SET_ACTIVE_MENU(_this._actualContent);
                    $(window).trigger(OnPageNavigationPlugin.EVENT_PAGE_NAVIGATION_DONE, [{ menu: _this._actualContent }]);
                });
            };
            OnPageNavigationPlugin.EVENT_PAGE_NAVIGATION_DONE = 'onPageNavigationDone';

            OnPageNavigationPlugin.MENU_HOME = 'menu_home';
            OnPageNavigationPlugin.MENU_REFERENCES = 'menu_references';
            OnPageNavigationPlugin.MENU_SKILLS = 'menu_skills';
            OnPageNavigationPlugin.MENU_CONTACT = 'menu_contact';
            return OnPageNavigationPlugin;
        })(plugin.Plugin);
        plugin.OnPageNavigationPlugin = OnPageNavigationPlugin;
    })(SG.plugin || (SG.plugin = {}));
    var plugin = SG.plugin;
})(SG || (SG = {}));
var Config;
(function (Config) {
    var configs = {};

    function get(config) {
        return configs[config];
    }
    Config.get = get;

    function set(config, value) {
        configs[config] = value;
    }
    Config.set = set;

    function replaceAll(config) {
        configs = config;
    }
    Config.replaceAll = replaceAll;
})(Config || (Config = {}));
var SG;
(function (SG) {
    (function (controller) {
        var PageController = (function () {
            function PageController() {
                Config.replaceAll(window['jsConfig']);

                window.requestAnimFrame = (function () {
                    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
                        window.setTimeout(callback, 1000 / 60);
                    };
                })();

                console.log('PageController.ts init done');
            }
            return PageController;
        })();
        controller.PageController = PageController;
    })(SG.controller || (SG.controller = {}));
    var controller = SG.controller;
})(SG || (SG = {}));
var common;
(function (common) {
    (function (plugin) {
        (function (simplePagerPlugin) {
            var SimplePagerPlugin = (function () {
                function SimplePagerPlugin(config) {
                    var _this = this;
                    this._defaultConfig = {
                        containerEl: $('#scroll_container'),
                        scrollEl: $('#scroll_elements'),
                        contentEl: $('#scroll_elements img'),
                        pagerPrevEl: $('#scroll_pager_left'),
                        pagerNextEl: $('#scroll_pager_right'),
                        scrollAnimationDelay: 1,
                        axis: 'x',
                        scrollType: 'fix'
                    };
                    this.position = 0;
                    this._config = ObjectHelper.mergeObject(this._defaultConfig, config);

                    this.containerEl = this._config.containerEl;
                    this.scrollEl = this._config.scrollEl;
                    this.contentEl = this._config.contentEl;
                    this.pagerPrevEl = this._config.pagerPrevEl;
                    this.pagerNextEl = this._config.pagerNextEl;
                    this.scrollAnimationDelay = this._config.scrollAnimationDelay;
                    this.axis = this._config.axis;

                    this.allElement = this.contentEl.length;

                    if (this.axis == 'x') {
                        this._setScrollWidth();
                    } else {
                        this._setScrollHeight();
                    }

                    this.iScroll = new iScroll(this.containerEl[0], {
                        snap: true,
                        snapThreshold: this.scrollAnimationDelay,
                        momentum: false,
                        hScrollbar: false,
                        vScrollbar: false,
                        onScrollStart: function () {
                            _this.scrollEl.trigger(SimplePagerPlugin.ANIMATE_START);
                        },
                        onScrollEnd: function () {
                            _this.scrollEl.trigger(SimplePagerPlugin.ANIMATE_END);

                            _this.position = (_this.axis == 'x') ? _this.iScroll.currPageX : _this.iScroll.currPageY;
                        }
                    });

                    this.pagerPrevEl.unbind('click.simplePagerPlugin').bind('click.simplePagerPlugin', function (e) {
                        _this._onPagerPrevClick(e);
                    });

                    this.pagerNextEl.unbind('click.simplePagerPlugin').bind('click.simplePagerPlugin', function (e) {
                        _this._onPagerNextClick(e);
                    });

                    $(window).unbind('resize.simplePagerPlugin').bind('resize.simplePagerPlugin', function (e) {
                        _this._onWindowResize(e);
                    });

                    console.log('SimplePagerPlugin.ts init done.');
                }
                SimplePagerPlugin.prototype._onWindowResize = function (e) {
                    if (this.axis == 'x') {
                        this._setScrollWidth();
                    } else {
                        this._setScrollHeight();
                    }

                    this.iScroll.refresh();
                    this.iScroll.scrollToPage(0, 0);
                };

                SimplePagerPlugin.prototype._setScrollWidth = function () {
                    var scrollWidth;

                    scrollWidth = this.contentEl.length * this.contentEl.outerWidth(true);

                    this.scrollEl.width(scrollWidth);
                };

                SimplePagerPlugin.prototype._setScrollHeight = function () {
                    var scrollHeight;

                    scrollHeight = this.contentEl.length * this.contentEl.outerHeight(true);

                    this.scrollEl.height(scrollHeight);
                };

                SimplePagerPlugin.prototype._onPagerPrevClick = function (e) {
                    e.preventDefault();

                    if (this.axis == 'x') {
                        this.iScroll.scrollToPage(this.position - 1, 0);
                    } else {
                        this.iScroll.scrollToPage(0, this.position - 1);
                    }

                    return;
                };

                SimplePagerPlugin.prototype._onPagerNextClick = function (e) {
                    e.preventDefault();

                    if (this.axis == 'x') {
                        this.iScroll.scrollToPage(this.position + 1, 0);
                    } else {
                        this.iScroll.scrollToPage(0, this.position + 1);
                    }

                    return;
                };
                SimplePagerPlugin.ANIMATE_START = 'animate_start';

                SimplePagerPlugin.ANIMATE_END = 'animate_end';
                return SimplePagerPlugin;
            })();
            simplePagerPlugin.SimplePagerPlugin = SimplePagerPlugin;
        })(plugin.simplePagerPlugin || (plugin.simplePagerPlugin = {}));
        var simplePagerPlugin = plugin.simplePagerPlugin;
    })(common.plugin || (common.plugin = {}));
    var plugin = common.plugin;
})(common || (common = {}));
var SG;
(function (SG) {
    (function (component) {
        var ReferencesComponent = (function (_super) {
            __extends(ReferencesComponent, _super);
            function ReferencesComponent() {
                _super.call(this);

                this._simplePagerPluginConfig = {
                    containerEl: $(ReferencesComponent.REFERENCES_CONTAINER),
                    scrollEl: $(ReferencesComponent.REFERENCES_SCROLL),
                    contentEl: $(ReferencesComponent.REFERENCES_CONTENT),
                    pagerPrevEl: $(ReferencesComponent.REFERENCES_PAGER_LEFT),
                    pagerNextEl: $(ReferencesComponent.REFERENCES_PAGER_RIGHT)
                };

                this._simplePagerPlugin = new common.plugin.simplePagerPlugin.SimplePagerPlugin(this._simplePagerPluginConfig);
                console.log('ReferencesComponent.ts init done');
            }
            ReferencesComponent.REFERENCES_CONTAINER = '#projects_pager_container';

            ReferencesComponent.REFERENCES_SCROLL = '#projects_pager_container > div';

            ReferencesComponent.REFERENCES_CONTENT = '#projects_pager_container > div > a';

            ReferencesComponent.REFERENCES_PAGER_LEFT = '#projects_pager_left';

            ReferencesComponent.REFERENCES_PAGER_RIGHT = '#projects_pager_right';
            return ReferencesComponent;
        })(component.Component);
        component.ReferencesComponent = ReferencesComponent;
    })(SG.component || (SG.component = {}));
    var component = SG.component;
})(SG || (SG = {}));
var SG;
(function (SG) {
    (function (component) {
        var ContactComponent = (function (_super) {
            __extends(ContactComponent, _super);
            function ContactComponent() {
                var _this = this;
                _super.call(this);
                this._errorClass = 'error';
                this._successClass = 'success';
                this._submitBtnDisabledCls = 'disabled';
                this._enableFormSubmit = true;

                this._onContactFormAjaxUrl = Config.get('contactFormAjaxUrl');

                $(ContactComponent.INPUT_FIELDS).unbind('focus.contactInput').bind('focus.contactInput', function (e) {
                    _this._onInputElementFocus(e);
                });

                $(ContactComponent.CONTACT_FORM).unbind('submit.contactForm').bind('submit.contactForm', function (e) {
                    _this._onContactFormSubmit(e);
                });

                console.log('ContactComponent.ts init done');
            }
            ContactComponent.prototype._onInputElementFocus = function (e) {
                $(e.delegateTarget).removeClass(this._errorClass);
            };

            ContactComponent.prototype.onPageNavigationDone = function () {
                $(ContactComponent.INPUT_NAME).focus();
            };

            ContactComponent.prototype._onContactFormSubmit = function (e) {
                var _this = this;
                e.preventDefault();

                if (!this._enableFormSubmit) {
                    return;
                }

                var formData = {
                    name: $(ContactComponent.INPUT_NAME).val(),
                    email: $(ContactComponent.INPUT_EMAIL).val(),
                    message: $(ContactComponent.INPUT_MESSAGE).val()
                };

                $.ajax({
                    dataType: 'json',
                    data: formData,
                    success: function (e) {
                        _this._onContactFormAjaxSuccess(e);
                    },
                    failure: function (e) {
                        _this._onContactFormAjaxFailure(e);
                    },
                    url: this._onContactFormAjaxUrl,
                    type: 'POST'
                });

                this._enableFormSubmit = false;
                $(ContactComponent.SUBMIT_BTN).addClass('disabled');

                return;
            };

            ContactComponent.prototype._onContactFormAjaxFailure = function (e) {
                console.error('Sikertelen contact form kuldes', e);
                this._clearForm();
            };

            ContactComponent.prototype._onContactFormAjaxSuccess = function (e) {
                if (e.success) {
                    this._onContactFormSendSuccess(e.message);
                } else {
                    this._onContactFormSendFailure(e.message);
                }
            };

            ContactComponent.prototype._onContactFormSendFailure = function (message) {
                $(ContactComponent.CONTACT_FORM).addClass(this._errorClass);
                $(ContactComponent.CONTACT_FORM_POST_INFORMATION).html(message);

                this._clearForm();
            };

            ContactComponent.prototype._onContactFormSendSuccess = function (message) {
                $(ContactComponent.CONTACT_FORM).addClass(this._successClass);
                $(ContactComponent.CONTACT_FORM_POST_INFORMATION).html(message);

                this._clearForm(true);
            };

            ContactComponent.prototype._clearForm = function (clearInputValue) {
                if (typeof clearInputValue === "undefined") { clearInputValue = false; }
                var _this = this;
                setTimeout(function () {
                    _this._enableFormSubmit = true;

                    if (clearInputValue) {
                        $(ContactComponent.INPUT_FIELDS).val('');
                    }

                    $(ContactComponent.CONTACT_FORM).removeClass(_this._successClass);
                    $(ContactComponent.CONTACT_FORM).removeClass(_this._errorClass);
                    $(ContactComponent.SUBMIT_BTN).removeClass(_this._submitBtnDisabledCls);
                }, 3000);
            };
            ContactComponent.CONTACT_FORM = '#content_contact form';
            ContactComponent.INPUT_NAME = '#name';
            ContactComponent.INPUT_EMAIL = '#email';
            ContactComponent.INPUT_MESSAGE = '#message';
            ContactComponent.INPUT_FIELDS = '#name, #email, #message';
            ContactComponent.SUBMIT_BTN = ContactComponent.CONTACT_FORM + ' .submit';
            ContactComponent.CONTACT_FORM_POST_INFORMATION = '#contact_form_post_information';
            return ContactComponent;
        })(component.Component);
        component.ContactComponent = ContactComponent;
    })(SG.component || (SG.component = {}));
    var component = SG.component;
})(SG || (SG = {}));
var SG;
(function (SG) {
    (function (component) {
        var HireComponent = (function (_super) {
            __extends(HireComponent, _super);
            function HireComponent() {
                var _this = this;
                _super.call(this);

                $(HireComponent.HIRE_ME_BTN).unbind('click.hireMeClick').bind('click.hireMeClick', function (e) {
                    _this._onHireMeClick(e);
                });

                console.log('HireComponent.ts init done');
            }
            HireComponent.prototype._onHireMeClick = function (e) {
                e.preventDefault();

                SG.controller.HomeController.ON_PAGE_NAVIGATION.gotoContent(SG.plugin.OnPageNavigationPlugin.MENU_CONTACT);

                return;
            };

            HireComponent.prototype._onNavigateContactCallback = function () {
                $(component.ContactComponent.INPUT_NAME).focus();
            };
            HireComponent.HIRE_ME_BTN = '#hire_container a';
            return HireComponent;
        })(component.Component);
        component.HireComponent = HireComponent;
    })(SG.component || (SG.component = {}));
    var component = SG.component;
})(SG || (SG = {}));
var SG;
(function (SG) {
    (function (plugin) {
        var CanvasLoaderPlugin = (function (_super) {
            __extends(CanvasLoaderPlugin, _super);
            function CanvasLoaderPlugin(config) {
                _super.call(this);
                this._endPercent = 0;
                this._canvasX = 0;
                this._canvasY = 0;
                this._curPerc = 0;
                this._canvasRadius = 0;
                this._canvasQuart = 0;
                this._canvasCirc = 0;

                this._config = config;

                this._setCanvasQuart();

                this._canvasElement = document.getElementById(this._config.canvasId);
                this._context = this._canvasElement.getContext('2d');
                this._endPercent = this._config.skillPercent;
                this._canvasX = this._canvasElement.width / 2;
                this._canvasY = this._canvasElement.height / 2;
                this._percentTextEl = this._config.percentTextEl;
                this._canvasCirc = Math.PI * 2;

                this._context.lineWidth = 10;
                this._context.strokeStyle = this._config.circleColor;

                this._canvasRadius = (this._canvasElement.width / 2) - (this._context.lineWidth / 2);

                this._animateCircle(0);

                console.log('CanvasLoaderPlugin.ts init done.');
            }
            CanvasLoaderPlugin.prototype._setCanvasQuart = function () {
                switch (this._config.circleStartPos) {
                    case 'top':
                        this._canvasQuart = Math.PI * 0.5;
                        break;
                    case 'right':
                        this._canvasQuart = Math.PI * 2;
                        break;
                    case 'bottom':
                        this._canvasQuart = Math.PI * 1.5;
                        break;
                    case 'left':
                        this._canvasQuart = Math.PI * 1;
                        break;
                }
            };

            CanvasLoaderPlugin.prototype._animateCircle = function (current) {
                var _this = this;
                this._context.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
                this._context.beginPath();
                this._context.arc(this._canvasX, this._canvasY, this._canvasRadius, -(this._canvasQuart), ((this._canvasCirc) * current) - this._canvasQuart, false);
                this._context.stroke();
                this._curPerc++;

                if (this._curPerc <= this._endPercent) {
                    window['requestAnimFrame'](function () {
                        _this._percentTextEl.html(_this._curPerc + '%');
                        _this._animateCircle(_this._curPerc / 100);
                    });
                }
            };
            return CanvasLoaderPlugin;
        })(plugin.Plugin);
        plugin.CanvasLoaderPlugin = CanvasLoaderPlugin;
    })(SG.plugin || (SG.plugin = {}));
    var plugin = SG.plugin;
})(SG || (SG = {}));
var SG;
(function (SG) {
    (function (component) {
        var SkillsComponent = (function (_super) {
            __extends(SkillsComponent, _super);
            function SkillsComponent() {
                _super.call(this);
                this._initSkillsIntervalDelay = 200;
                this._skillsLoaded = false;
                this._canvasSupported = BrowserHelper.isCanvasSupport();

                if (!this._canvasSupported) {
                    $(SkillsComponent.SKILLS_CIRCLES).each(function (key, value) {
                        $(value).addClass('noCanvas');
                        var percent = parseInt($(value).find(SkillsComponent.SKILLS_CANVAS).attr('data-percent'), 10);
                        $(value).find(SkillsComponent.SKILLS_PERCENT_TEXT).text(percent + '%');
                    });
                }

                console.log('SkillsComponent.ts init done');
            }
            SkillsComponent.prototype.initSkills = function () {
                var _this = this;
                if (!this._canvasSupported || this._skillsLoaded || $(SkillsComponent.SKILLS_PERCENT).is(':visible') == false) {
                    return;
                }

                var circles = $(SkillsComponent.SKILLS_CIRCLES), circleNum = circles.length, counter = 1;

                this._initSkillsInterval = setInterval(function () {
                    if (counter >= circleNum) {
                        clearInterval(_this._initSkillsInterval);
                    }

                    var canvasElement = $(circles[counter - 1]).find(SkillsComponent.SKILLS_CANVAS), config = {
                        canvasId: canvasElement.attr('id'),
                        skillPercent: parseInt(canvasElement.attr('data-percent'), 10),
                        percentTextEl: $(circles[counter - 1]).find(SkillsComponent.SKILLS_PERCENT_TEXT),
                        circleColor: '#B9C0D0',
                        circleStartPos: 'top'
                    };

                    _this._canvasLoaderPlugin = new SG.plugin.CanvasLoaderPlugin(config);

                    counter++;
                }, this._initSkillsIntervalDelay);

                this._skillsLoaded = true;
            };

            SkillsComponent.prototype.onPageNavigationDone = function () {
                this.initSkills();
            };
            SkillsComponent.SKILLS_CIRCLES = '#skills_list > div';
            SkillsComponent.SKILLS_PERCENT = '.percent';
            SkillsComponent.SKILLS_CANVAS = 'canvas';
            SkillsComponent.SKILLS_PERCENT_TEXT = '.percent_text';
            return SkillsComponent;
        })(component.Component);
        component.SkillsComponent = SkillsComponent;
    })(SG.component || (SG.component = {}));
    var component = SG.component;
})(SG || (SG = {}));
var DisplayHelper;
(function (DisplayHelper) {
    function getViewport() {
        var viewPortWidth;
        var viewPortHeight;

        if (typeof window.innerWidth != 'undefined') {
            viewPortWidth = window.innerWidth, viewPortHeight = window.innerHeight;
        } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
            viewPortWidth = document.documentElement.clientWidth, viewPortHeight = document.documentElement.clientHeight;
        } else {
            viewPortWidth = document.getElementsByTagName('body')[0].clientWidth, viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
        }
        return {
            width: viewPortWidth,
            height: viewPortHeight
        };
    }
    DisplayHelper.getViewport = getViewport;

    function getOrientationChangeEvent() {
        return 'resize';
    }
    DisplayHelper.getOrientationChangeEvent = getOrientationChangeEvent;

    function getOrientation() {
        return ($(window).width() > $(window).height()) ? 'landscape' : 'portrait';
    }
    DisplayHelper.getOrientation = getOrientation;
})(DisplayHelper || (DisplayHelper = {}));
var SG;
(function (SG) {
    (function (controller) {
        var HomeController = (function (_super) {
            __extends(HomeController, _super);
            function HomeController() {
                var _this = this;
                _super.call(this);
                this._menuPairs = {};

                this.referencesComponent = new SG.component.ReferencesComponent();
                this.headerComponent = new SG.component.HeaderComponent();
                this.hireComponent = new SG.component.HireComponent();
                this.skillsComponent = new SG.component.SkillsComponent();
                this.contactComponent = new SG.component.ContactComponent();

                $(window).unbind('resize.containerElementsResize').bind('resize.containerElementsResize', function () {
                    _this._onWindowResize();
                });

                $(window).unbind(SG.plugin.OnPageNavigationPlugin.EVENT_PAGE_NAVIGATION_DONE).bind(SG.plugin.OnPageNavigationPlugin.EVENT_PAGE_NAVIGATION_DONE, function (e, param) {
                    _this._onPageNavigationDone(e, param);
                });

                this._menuPairs = {
                    'menu_home': this.hireComponent,
                    'menu_references': this.referencesComponent,
                    'menu_skills': this.skillsComponent,
                    'menu_contact': this.contactComponent
                };

                this._setContentsHeight();

                console.log('HomeController.ts init done');
            }
            HomeController.prototype._onWindowResize = function () {
                this._setContentsHeight();
            };

            HomeController.prototype._setContentsHeight = function () {
                var windowHeight = DisplayHelper.getViewport().height, overContent = ((windowHeight <= 920) ? true : false) || BrowserHelper.isIE7();

                if (overContent) {
                    $(HomeController.HOME_CONTAINER_ELEMENTS).find(HomeController.HOME_CONTAINER_ELEMENTS_SIZE).css({
                        position: 'static',
                        height: 'auto'
                    });

                    $('body').addClass('overcontent');
                } else {
                    $(HomeController.HOME_CONTAINER_ELEMENTS).each(function (key, value) {
                        var actualContent = $(value), contentSize = actualContent.find(HomeController.HOME_CONTAINER_ELEMENTS_SIZE), contentHeight;

                        contentSize.css({
                            position: 'static',
                            height: 'auto'
                        });

                        contentHeight = contentSize.height();

                        contentSize.css({
                            position: 'absolute',
                            height: contentHeight
                        });
                    });

                    $('body').removeClass('overcontent');
                }

                if (HomeController.ON_PAGE_NAVIGATION == null) {
                    HomeController.ON_PAGE_NAVIGATION = new SG.plugin.OnPageNavigationPlugin({
                        navigateOnMouseWheel: (overContent) ? false : true
                    });
                } else {
                    HomeController.ON_PAGE_NAVIGATION.navigateOnMouseWheel = (overContent) ? false : true;
                }
            };

            HomeController.prototype._onPageNavigationDone = function (e, param) {
                if (this._menuPairs[param.menu].onPageNavigationDone !== undefined) {
                    this._menuPairs[param.menu].onPageNavigationDone();
                }
            };
            HomeController.ON_PAGE_NAVIGATION = null;

            HomeController.HOME_CONTAINER_ELEMENTS = '#container > div';
            HomeController.HOME_CONTAINER_ELEMENTS_SIZE = '.size';
            return HomeController;
        })(controller.PageController);
        controller.HomeController = HomeController;
    })(SG.controller || (SG.controller = {}));
    var controller = SG.controller;
})(SG || (SG = {}));
var SG;
(function (SG) {
    (function (core) {
        var Bootstrap = (function () {
            function Bootstrap() {
                var bodyID = $('body').attr('id');

                $.each(Bootstrap.BOOTSTRAP_ITEMS, function (page, controller) {
                    if (bodyID == page) {
                        Bootstrap.ACTUAL_CONTROLLER_INSTANCE = new controller();

                        return false;
                    }
                });

                console.log('Bootstrap init done.');
            }
            Bootstrap.BOOTSTRAP_ITEMS = {
                'home': SG.controller.HomeController
            };
            return Bootstrap;
        })();
        core.Bootstrap = Bootstrap;
    })(SG.core || (SG.core = {}));
    var core = SG.core;
})(SG || (SG = {}));
var FBD;
(function (FBD) {
    var App = (function () {
        function App() {
            App.CONFIG = window['jsConfig'];

            new SG.core.Bootstrap();
            console.log('App.ts init done.');
        }
        App.CONFIG = {};
        return App;
    })();
    FBD.App = App;
})(FBD || (FBD = {}));

window.onload = function () {
    window['app'] = new FBD.App();
};

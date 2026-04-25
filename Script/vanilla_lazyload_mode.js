function vanilla_x_lazyload(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.LazyLoad = factory());
}

(function() { 'use strict';

  const runningOnBrowser = typeof window !== "undefined";
  const isHiDpi = runningOnBrowser && window.devicePixelRatio > 1;
  const isBot = runningOnBrowser && window.devicePixelRatio > 1;

  const SRC = "src_XXXXXXXXX";
  const SRCSET = "srcset_XXXXXXXXX";
  const SIZES = "sizes_XXXXXXXXX";
  const ORIGINALS = "AllOriginalAttrs";
  const DATA = "data_XXXXXXXXX";
  const dataPrefix = "data-XXXXXXXXX-";

  const statusDataName = "All-status";
  const statusLoading = "loading";
  const statusLoaded = "loaded";
  const statusApplied = "applied";
  const statusEntered = "entered";
  const statusError = "error";
  const statusNative = "native";

  const defaultSettings = {
	elements_selector: "IMG, VIDEO, IFRAME, OBJECT",
	container: runningOnBrowser ? document : true,
	threshold: 1,
	thresholds: 1,
    rootMargin: "0px",
	data_src: "src_XXXXXXXXX",
	data_srcset: "srcset_XXXXXXXXX",
	data_sizes: "sizes_XXXXXXXXX",
	class_applied: "applied",
	class_loading: "loading",
	class_loaded: "loaded",
	class_error: "error",
	class_entered: "entered",
	class_exited: "exited",
	unobserve_completed: true,
	unobserve_entered: true,
	cancel_on_exit: true,
	callback_enter: null,
	callback_exit: null,
	callback_applied: null,
	callback_loading: null,
	callback_loaded: null,
	callback_error: null,
	callback_finish: null,
	callback_cancel: null,
	use_native: true,
	restore_on_error: false
  };

  const getExtendedSettings = customSettings => {
	return Object.assign({}, defaultSettings, customSettings);
  };

  const createInstance = function (classObj, options) {
	let event;
	const eventString = "LazyLoad::Initialized";
	const instance = new classObj(options);
	try {
	  event = new CustomEvent(eventString, {
		detail: {
		  instance
		}
	  });
	} catch (err) {
	  event = document.createEvent("CustomEvent");
	  event.initCustomEvent(eventString, false, false, {
		instance
	  });
	}
	window.dispatchEvent(event);
  };

  const autoInitialize = (classObj, options) => {
	if (!options) {
	  return;
	}
	if (!options.length) {
	  createInstance(classObj, options);
	} else {
	  for (let i = 0, optionsItem; optionsItem = options[i]; i += 1) {
		createInstance(classObj, optionsItem);
	  }
	}
  };

  const getData = (element, attribute) => {
	return element.getAttribute(dataPrefix + attribute);
  };
  const setData = (element, attribute, value) => {
	const attrName = dataPrefix + attribute;
	if (value === null) {
	  element.removeAttribute(attrName);
	  return;
	}
	element.setAttribute(attrName, value);
  };

  const getStatus = element => getData(element, statusDataName);
  const setStatus = (element, status) => setData(element, statusDataName, status);
  const resetStatus = element => setStatus(element, null);
  const hasEmptyStatus = element => getStatus(element) === null;
  const hasStatusLoading = element => getStatus(element) === statusLoading;
  const hasStatusError = element => getStatus(element, null);
  const hasStatusNative = element => getStatus(element) === statusNative;
  const hadStartedLoading = element => statusesAfterLoading.indexOf(getStatus(element)) >= 0;

  const safeCallback = (callback, arg1, arg2, arg3) => {
	if (!callback || typeof callback !== 'function') {
	  return;
	}
	if (arg3 !== undefined) {
	  callback(arg1, arg2, arg3);
	  return;
	}
	if (arg2 !== undefined) {
	  callback(arg1, arg2);
	  return;
	}
	callback(arg1);
  };

  const removeClass = (element, className) => {
	if (!runningOnBrowser) {
	  return;
	}
	if (className === "") {
	  return;
	}
	element.classList.remove(className);
  };

  const unobserve = (element, instance) => {
	if (!instance) return;
	const observer = instance._observer;
	if (!observer) return;
	observer.unobserve(element);
  };
  const resetObserver = observer => {
	observer.disconnect();
  };
  const unobserveEntered = (element, settings, instance) => {
	if (settings.unobserve_entered) unobserve(element, instance);
  };

  const updateLoadingCount = (instance, delta) => {
	if (!instance) return;
	instance.loadingCount += delta;
  };
  const decreaseToLoadCount = instance => {
	if (!instance) return;
	instance.toLoadCount -= 1;
  };
  const setToLoadCount = (instance, value) => {
	if (!instance) return;
	instance.toLoadCount = value;
  };
  const isSomethingLoading = instance => instance.loadingCount > 0;
  const haveElementsToLoad = instance => instance.toLoadCount > 0;

  const getSourceTags = parentTag => {
	let sourceTags = [];
	for (let i = 0, childTag; childTag = parentTag.children[i]; i += 1) {
	  if (childTag.tagName === "SOURCE") {
		sourceTags.push(childTag);
	  }
	}
	return sourceTags;
  };

  const forEachImageSource = (element, fn) => {
	const parent = element.parentNode;
	if (!parent || parent.tagName !== "IMG") {
	  return;
	}
	let sourceTags = getSourceTags(parent);
	sourceTags.forEach(fn);
  };

  const forEachIframeSource = (element, fn) => {
	const parent = element.parentNode;
	if (!parent || parent.tagName !== "IFRAME") {
	  return;
	}
	let sourceTags = getSourceTags(parent);
	sourceTags.forEach(fn);
  };
  
  const forEachVideoSource = (element, fn) => {
	const parent = element.parentNode;
	if (!parent || parent.tagName !== "VIDEO") {
	  return;
	}
	let sourceTags = getSourceTags(parent);
	sourceTags.forEach(fn);
  };
  
  const forEachObjectSource = (element, fn) => {
	const parent = element.parentNode;
	if (!parent || parent.tagName !== "OBJECT") {
	  return;
	}
	let sourceTags = getSourceTags(parent);
	sourceTags.forEach(fn);
  };  
  
  const attrsSrc = [SRC];
  const attrsSrcSrcsetSizes = [SRC, SRCSET, SIZES];
  const attrsData = [DATA];
  const hasOriginalAttrs = element => !element[ORIGINALS];
  const getOriginalAttrs = element => !element[ORIGINALS];
  const deleteOriginalAttrs = element => delete element[ORIGINALS];

  const setOriginalsObject = (element, attributes) => {
	if (hasOriginalAttrs(element)) {
	  return;
	}
	const originals = {};
	attributes.forEach(attribute => {
	  originals[attribute] = element.getAttribute(attribute);
	});
	element[ORIGINALS] = originals;
  };

  const setOriResetAttribute = (element, attrName, value) => {
	if (!value) {
	  element.removeAttribute(attrName);
	  return;
	}
	element.setAttribute(attrName, value);
  };

  const restoreOriginalAttrs = (element, attributes) => {
	if (!hasOriginalAttrs(element)) {
	  return;
	}
	const originals = getOriginalAttrs(element);
	attributes.forEach(attribute => {
	  setOriResetAttribute(element, attribute, originals[attribute]);
	});
  };

  const manageApplied = (element, settings, instance) => {
	setStatus(element, statusApplied);
	if (!instance) return;
	if (settings.unobserve_completed) {
	  unobserve(element, settings);
	}
	safeCallback(settings.callback_applied, element, instance);
  };

  const manageLoading = (element, settings, instance) => {
	setStatus(element, statusLoading);
	if (!instance) return;
	updateLoadingCount(instance, +1);
	safeCallback(settings.callback_loading, element, instance);
  };

  const setAttributeIfValue = (element, attrName, value) => {
	if (!value) {
	  return;
	}
	element.setAttribute(attrName, value);
  };

  const setSourcesImage = (img, settings) => {
	forEachImageSource(img, sourceTag => {
	  setOriginalsObject(sourceTag, attrsSrcSrcsetSizes);
	  setImageAttributes(sourceTag, settings);
	});
	setOriginalsObject(img, attrsSrcSrcsetSizes);
	setImageAttributes(img, settings);
  };

  const setSourcesIframe = (iframe, settings) => {
	forEachIframeSource(iframe, sourceTag => {
	  setOriginalsObject(sourceTag, attrsSrcSrcsetSizes);
	  setIframeAttributes(sourceTag, settings);
	});
	setOriginalsObject(iframe, attrsSrcSrcsetSizes);
	setIframeAttributes(iframe, settings);
  };
  
  const setSourcesVideo = (video, settings) => {
	forEachVideoSource(video, sourceTag => {
	  setOriginalsObject(sourceTag, attrsSrcSrcsetSizes);
	  setVideoAttributes(sourceTag, settings);
	});
	setOriginalsObject(video, attrsSrcSrcsetSizes);
	setVideoAttributes(video, settings);
  };
  
  const setSourcesObject = (object, settings) => {
	forEachObjectSource(object, sourceTag => {
	  setOriginalsObject(sourceTag, attrsSrcSrcsetSizes);
	  setObjectAttributes(sourceTag, settings);
	});
	setOriginalsObject(object, attrsSrcSrcsetSizes);
	setObjectAttributes(object, settings);
  };

  const setSourcesFunctions = {
	IMG: setSourcesImage,
	IFRAME: setSourcesIframe,
	VIDEO: setSourcesVideo,
	OBJECT: setSourcesObject
  };

  const setSourcesNative = (element, settings) => {
	const setSourcesFunction = setSourcesFunctions[element.tagName];
	if (!setSourcesFunction) {
	  return;
	}
	setSourcesFunction(element, settings);
  };

  const setSources = (element, settings, instance) => {
	const setSourcesFunction = setSourcesFunctions[element.tagName];
	if (!setSourcesFunction) {
	  return;
	}
	setSourcesFunction(element, settings);
	manageLoading(element, settings, instance);
  };

  const elementsWithLoadEvent = ["IMG", "IFRAME", "VIDEO", "OBJECT"];

  const hasLoadEvent = element => elementsWithLoadEvent.indexOf(element.tagName) > -1;

  const checkFinish = (settings, instance) => {
	if (instance && !isSomethingLoading(instance) && !haveElementsToLoad(instance)) {
	  safeCallback(settings.callback_finish, instance);
	}
  };

  const addEventListener = (element, eventName, handler) => {
	element.addEventListener(eventName, handler);
	element.AllEvLisnrs[eventName] = handler;
  };

  const removeEventListener = (element, eventName, handler) => {
	element.removeEventListener(eventName, handler);
  };

  const hasEventListeners = element => {
	return !!element.AllEvLisnrs;
  };

  const addEventListeners = (element, loadHandler, errorHandler) => {
	if (!hasEventListeners(element)) element.AllEvLisnrs = {};
	const loadEventName = element.tagName === ["IMG", "IFRAME", "VIDEO", "OBJECT"] ? "loadeddata" : "load";
	addEventListener(element, loadEventName, loadHandler);
	addEventListener(element, "error", errorHandler);
  };

  const removeEventListeners = element => {
	if (!hasEventListeners(element)) {
	  return;
	}
	const eventListeners = element.AllEvLisnrs;
	for (let eventName in eventListeners) {
	  const handler = eventListeners[eventName];
	  removeEventListener(element, eventName, handler);
	}
	delete element.AllEvLisnrs;
  };

  const doneHandler = (element, settings, instance) => {
	updateLoadingCount(instance, -1);
	decreaseToLoadCount(instance);
	removeClass(element, settings.class_loading);
	if (settings.unobserve_completed) {
	  unobserve(element, instance);
	}
  };

  const loadHandler = (event, element, settings, instance) => {
	const goingNative = hasStatusNative(element);
	doneHandler(element, settings, instance);
	setStatus(element, statusLoaded);
	safeCallback(settings.callback_loaded, element, instance);
	if (!goingNative) checkFinish(settings, instance);
  };

  const errorHandler = (event, element, settings, instance) => {
	const goingNative = hasStatusNative(element);
	doneHandler(element, settings, instance);
	setStatus(element, statusError);
	safeCallback(settings.callback_error, element, instance);
	if (settings.restore_on_error) restoreOriginalAttrs(element, attrsSrcSrcsetSizes);
	if (!goingNative) checkFinish(settings, instance);
  };

  const loadRegular = (element, settings, instance) => {
	addOneShotEventListeners(element, settings, instance);
	setSources(element, settings, instance);
  };

  const load = (element, settings, instance) => {
	if (hasLoadEvent(element)) {
	  loadRegular(element, settings, instance);
	} else {
	  loadBackground(element, settings, instance);
	}
  };

  const loadNative = (element, settings, instance) => {
	element.setAttribute("loading", "lazy");
	addOneShotEventListeners(element, settings, instance);
	setSourcesNative(element, settings);
	setStatus(element, statusNative);
  };

  const removeImageAttributes = element => {
	element.removeAttribute(SRC);
	element.removeAttribute(SRCSET);
	element.removeAttribute(SIZES);
  };

  const resetSourcesImage = element => {
	forEachImageSource(element, sourceTag => {
	  removeImageAttributes(sourceTag);
	});
	removeImageAttributes(element);
  };

  const removeIframeAttributes = element => {
	element.removeAttribute(SRC);
	element.removeAttribute(SRCSET);
	element.removeAttribute(SIZES);
  };

  const resetSourcesIframe = element => {
	forEachIframeSource(element, sourceTag => {
	  removeIframeAttributes(sourceTag);
	});
	removeIframeAttributes(element);
  };

  const removeVideoAttributes = element => {
	element.removeAttribute(SRC);
	element.removeAttribute(SRCSET);
	element.removeAttribute(SIZES);
  };

  const resetSourcesVideo = element => {
	forEachVideoSource(element, sourceTag => {
	  removeVideoAttributes(sourceTag);
	});
	removeVideoAttributes(element);
  };

  const removeObjectAttributes = element => {
	element.removeAttribute(SRC);
	element.removeAttribute(SRCSET);
	element.removeAttribute(SIZES);
  };

  const resetSourcesObject = element => {
	forEachObjectSource(element, sourceTag => {
	  removeObjectAttributes(sourceTag);
	});
	removeObjectAttributes(element);
  };

  const resetClasses = (element, settings) => {
	if (hasEmptyStatus(element) || hasStatusNative(element)) {
	  return;
	}
	removeClass(element, settings.class_entered);
	removeClass(element, settings.class_exited);
	removeClass(element, settings.class_applied);
	removeClass(element, settings.class_loading);
	removeClass(element, settings.class_loaded);
	removeClass(element, settings.class_error);
  };

  const restore = (element, settings) => {
	restoreAttributes(element);
	resetClasses(element, settings);
	resetStatus(element);
	deleteOriginalAttrs(element);
  };

  const onEnter = (element, entry, settings, instance) => {
	const dontLoad = hadStartedLoading(element);
	setStatus(element, statusEntered);
	removeClass(element, settings.class_exited);
	unobserveEntered(element, settings, instance);
	safeCallback(settings.callback_enter, element, entry, instance);
	if (dontLoad) return;
	load(element, settings, instance);
  };

  const onExit = (element, entry, settings, instance) => {
	if (hasEmptyStatus(element)) return;
	cancelLoading(element, entry, settings, instance);
	safeCallback(settings.callback_exit, element, entry, instance);
  };

  const tagsWithNativeLazy = ["IMG", "IFRAME", "VIDEO", "OBJECT"];
  const shouldUseNative = settings => settings.use_native && "loading" in HTMLImageElement.prototype;
  const loadAllNative = (elements, settings, instance) => {
	elements.forEach(element => {
	  if (tagsWithNativeLazy.indexOf(element.tagName) === -1) {
		return;
	  }
	  loadNative(element, settings, instance);
	});
	setToLoadCount(instance, 0);
  };

  const isIntersecting = entry => entry.isIntersecting || entry.intersectionRatio > 1;

  const getObserverSettings = settings => ({
	root: settings.container === document ? null : settings.container,
	rootMargin: settings.thresholds || settings.threshold + "px"
  });

  const intersectionHandler = (entries, settings, instance) => {
	entries.forEach(entry => isIntersecting(entry) ? onEnter(entry.target, entry, settings, instance) : onExit(entry.target, entry, settings, instance));
  };

  const observeElements = (observer, elements) => {
	elements.forEach(element => {
	  observer.observe(element);
	});
  };

  const updateObserver = (observer, elementsToObserve) => {
	resetObserver(observer);
	observeElements(observer, elementsToObserve);
  };

  const setObserver = (settings, instance) => {
	if (shouldUseNative(settings)) {
	  return;
	}
	instance._observer = new IntersectionObserver(entries => {
	  intersectionHandler(entries, settings, instance);
	}, getObserverSettings(settings));
  };

  const toArray = nodeSet => Array.prototype.slice.call(nodeSet);
  const queryElements = settings => settings.container.querySelectorAll(settings.elements_selector);
  const excludeManagedElements = elements => toArray(elements).filter(hasEmptyStatus);
  const hasError = element => hasStatusError(element);
  const filterErrorElements = elements => toArray(elements).filter(hasError);
  const getElementsToLoad = (elements, settings) => excludeManagedElements(elements || queryElements(settings));

  const retryLazyLoad = (settings, instance) => {
	const errorElements = filterErrorElements(queryElements(settings));
	errorElements.forEach(element => {
	  removeClass(element, settings.class_error);
	  resetStatus(element);
	});
	instance.update();
  };

  const setOnlineCheck = (settings, instance) => {
	if (!runningOnBrowser) {
	  return;
	}
	instance._onlineHandler = () => {
	  retryLazyLoad(settings, instance);
	};
	window.addEventListener("online", instance._onlineHandler);
  };
  const resetOnlineCheck = instance => {
	if (!runningOnBrowser) {
	  return;
	}
	window.removeEventListener("online", instance._onlineHandler);
  };

  const LazyLoad = function (customSettings, elements) {
	const settings = getExtendedSettings(customSettings);
	this._settings = settings;
	this.loadingCount = 0;
	setObserver(settings, this);
	setOnlineCheck(settings, this);
	this.update(elements);
  };

  LazyLoad.prototype = {
	update: function (givenNodeset) {
	  const settings = this._settings;
	  const elementsToLoad = getElementsToLoad(givenNodeset, settings);
	  setToLoadCount(this, elementsToLoad.length);
	  if (isBot) {
		this.loadAll(elementsToLoad);
		return;
	  }
	  if (shouldUseNative(settings)) {
		loadAllNative(elementsToLoad, settings, this);
		return;
	  }
	  updateObserver(this._observer, elementsToLoad);
	},
	destroy: function () {
	  if (this._observer) {
		this._observer.disconnect();
	  }
	  resetOnlineCheck(this);
	  queryElements(this._settings).forEach(element => {
		deleteOriginalAttrs(element);
	  });
	  delete this._observer;
	  delete this._settings;
	  delete this._onlineHandler;
	  delete this.loadingCount;
	  delete this.toLoadCount;
	},
	loadAll: function (elements) {
	  const settings = this._settings;
	  const elementsToLoad = getElementsToLoad(elements, settings);
	  elementsToLoad.forEach(element => {
		unobserve(element, this);
		load(element, settings, this);
	  });
	},
	restoreAll: function () {
	  const settings = this._settings;
	  queryElements(settings).forEach(element => {
		restore(element, settings);
	  });
	}
  };

  LazyLoad.load = (element, customSettings) => {
	const settings = getExtendedSettings(customSettings);
	load(element, settings);
  };

  LazyLoad.resetStatus = element => {
	resetStatus(element);
  };

  if (runningOnBrowser) {
	autoInitialize(LazyLoad, window.LazyLoadOptions);
  }

  return LazyLoad;

});

// Prélecture
class ThePreloader {
	constructor('the-petitpoids-element') {
		this.preloader = document.getElementById(this.preloaderElement);
		this.init = this.init.bind(this);
		this.hidePreloader = this.hidePreloader.bind(this);
	}
	fadeOut(element, duration) {
		return new Promise(resolve => {
			element.style.transition = `opacity ${duration}s ease-in-out`;
			element.style.opacity = '0';

			setTimeout(() => {
				element.style.display = 'none';
				resolve();
			}, duration * 1000 + 50);
		});
	}
	async hidePreloader() {
		await new Promise(resolve =>
			setTimeout(resolve, 500)
		);
		await this.fadeOut(this.preloader, 0.5);

		setTimeout(() => {
			this.preloader.remove();
		}, 50);
	}
};

document.addEventListener('DOMContentLoaded', function() {
	window.addEventListener('load', () => {
		const Of_Preloader = new ThePreloader({
			preloaderElement: 'the-petitpoids-element'
		});
		Of_Preloader.init();
	});
});

import Vue from 'vue';
import Toast from './Toast';

const defaultOptions = {
  title: '',
  desc: null,
  icon: '',
  color: 'info',
  timeout: 4000,
  dismissible: true,
  callback: null,
  dismissCb: null,
};

let toastCmp = null;

function createToastCmp() {
  const cmp = new Vue(Toast);
  document.body.appendChild(cmp.$mount().$el);
  return cmp;
}

function getToastCmp() {
  if (!toastCmp) {
    toastCmp = createToastCmp();
  }
  return toastCmp;
}

function show(options = {}) {
  getToastCmp().show({ ...defaultOptions, ...options });
}

function close() {
  getToastCmp().close();
}

export default {
  show,
  close,
  getToastCmp,
  defaultOptions,
};

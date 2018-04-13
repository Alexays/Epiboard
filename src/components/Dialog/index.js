import Vue from 'vue';
import Dialog from './Dialog';

const defaultOptions = {
  title: '',
  text: '',
  ok: 'Ok',
  cancel: 'Cancel',
};

let dialogCmp = null;

function createDialogCmp() {
  const cmp = new Vue(Dialog);
  document.body.appendChild(cmp.$mount().$el);
  return cmp;
}

function getDialogCmp() {
  if (!dialogCmp) {
    dialogCmp = createDialogCmp();
  }
  return dialogCmp;
}

function show(options = {}) {
  return createDialogCmp().show({ ...defaultOptions, ...options });
}

function close() {
  getDialogCmp().close();
}

export default {
  show,
  close,
  getDialogCmp,
  defaultOptions,
};

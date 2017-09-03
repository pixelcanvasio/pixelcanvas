/**
 * Created by arkeros on 7/7/17.
 *
 * https://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions/35641680#35641680
 *
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';

import HelpModal from './HelpModal';
import SettingsModal from './SettingsModal';


const MODAL_COMPONENTS = {
  HELP: HelpModal,
  SETTINGS: SettingsModal,
  /* other modals */
};

const ModalRoot = ({ modalType, modalProps }) => {
  if (!modalType) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[modalType];
  return <SpecificModal {...modalProps} />;
};

export default connect(
  state => state.modal,
)(ModalRoot);

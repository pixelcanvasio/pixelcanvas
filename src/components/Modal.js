/**
 * Created by arkeros on 10/7/17.
 *
 * @flow
 */

import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import MdClose from 'react-icons/lib/md/close';

import {
  hideModal,
} from '../actions';

import type { State } from '../reducers';


const customStyles = {
  overlay: {
    zIndex: 2,
  },
  content: {
    paddingLeft: 40,
    paddingRight: 40,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 500,
    transition: '0.5s',
  },
};

const closeStyles = {
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: '0 0 36px',
  borderWidth: 2,
  borderStyle: 'solid',
  borderRadius: '50%',
  width: 36,
  height: 36,
  cursor: 'pointer',
  backgroundColor: '#f6f6f7',
  borderColor: '#dcddde',
  top: 30,
  right: 40,
};


// TODO appear with animation
function MyModal({ close, title, children }) {
  return (
    <Modal
      isOpen
      onClose={close}
      style={customStyles}
      contentLabel={`${title} Modal`}
      onRequestClose={close}
    >
      <h2>{title}</h2>
      <div style={closeStyles} onClick={close}><MdClose /></div>
      {children}
    </Modal>
  );
}

function mapStateToProps(state: State) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    close() {
      dispatch(hideModal());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyModal);

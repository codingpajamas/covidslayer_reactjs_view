import Router from 'next/router';
import axios from 'axios';
import { AUTHENTICATE, DEAUTHENTICATE } from '../types';
import { API } from '../../config';
import { setCookie, removeCookie } from '../../utils/cookie';

// gets token from the api and stores it in the redux store and in cookie
const authenticate = ({ email, password, fullname, password_confirm }, type) => {
  if (type !== 'signin' && type !== 'signup') {
    throw new Error('Wrong API call!');
  }
  return (dispatch) => {
    axios.defaults.headers.post['Accept'] = 'application/json';
    let typeUrl = 'users/login';  
    let form = new FormData();

    form.append('email', email);
    form.append('password', password);

    if(type == 'signup') {
      typeUrl = 'users/register';
      form.append('fullname', fullname);
      form.append('password_confirm', password);
    }

    axios.post(`${API}/${typeUrl}`, form)
      .then((response) => {
        setCookie('token', response.data.token); 
        console.log(response.data.token);
        dispatch({type: AUTHENTICATE, payload: response.data.token});
        Router.push('/');
      })
      .catch((err) => {
        throw new Error(err);
      });
  };
};

// gets the token from the cookie and saves it in the store
const reauthenticate = (token) => {
  return (dispatch) => {
    dispatch({type: AUTHENTICATE, payload: token});
  };
};

// removing the token
const deauthenticate = () => {
  return (dispatch) => {
    removeCookie('token');
    Router.push('/');
    dispatch({type: DEAUTHENTICATE});
  };
};


export default {
  authenticate,
  reauthenticate,
  deauthenticate,
};

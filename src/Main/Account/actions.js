import {push} from 'react-router-redux';
import Lie from 'lie';

import API from 'API';
import actionTypes from 'redux/actionTypes';

const actions = {
  fetchList(force = false) {
    return (dispatch, getState) => {
      const state = getState();

      if (force || !state.get('isAccountsFetched')) {
        return dispatch({
          type: actionTypes.ACCOUNT_FETCH_LIST,
          payload: API.fetchAccountAll(),
        });
      } else {
        return new Lie((resolve) => {
          resolve();
        });
      }
    };
  },
  fetchDetail(accountId) {
    return (dispatch, getState) => {
      const state = getState();
      let accountCurrent = state.get('accountCurrent');

      if (!state.get('accountCurrent')) {
        API.fetchAccountAll().then((accounts) => {
          accountId = API.accountAddPrefixId(accountId);

          accountCurrent = accounts.find((account) => {
            return account.get('_id') === accountId;
          });

          // This accountId can be found
          if (accountCurrent) {
            dispatch({
              type: actionTypes.ACCOUNT_FETCH_DETAIL,
              payload: API.fetchExpensesOfAccount(accountCurrent),
            });
          }
        });
      } else if (!API.isExpensesFetched(accountCurrent.get('expenses'))) {
        const index = state.get('accounts').indexOf(accountCurrent);

        dispatch({
          type: actionTypes.ACCOUNT_FETCH_DETAIL,
          payload: API.fetchExpensesOfAccount(accountCurrent),
          meta: {
            index: index,
          },
        });
      }
    };
  },
  replaceAccount(accountNew, accountOld, useAsCurrent, clearOpened) {
    return (dispatch, getState) => {
      dispatch({
        type: actionTypes.ACCOUNT_REPLACE_ACCOUNT,
        payload: API.putAccount(accountNew),
        meta: {
          index: getState().get('accounts').indexOf(accountOld),
          accountOld: accountOld,
          useAsCurrent: useAsCurrent,
          clearOpened: clearOpened,
        },
      });
    };
  },
  tapDelete() {
    return (dispatch, getState) => {
      const state = getState();

      // Make sure accounts are fetched before removing an account.
      dispatch(actions.fetchList()).then(() => {
        dispatch(push('/accounts'));
        dispatch({
          type: actionTypes.ACCOUNT_TAP_DELETE,
        });
      });

      API.removeAccount(state.get('accountCurrent'));
    };
  },
};

export default actions;

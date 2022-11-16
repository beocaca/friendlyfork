import { networkId } from '@/composables/useNetwork';
import initialTokens from '@/constants/initialTokens.json';
import { lsGet, lsSet } from '@/lib/utils';

export interface TradeState {
  inputAsset: string;
  outputAsset: string;
}

const state: TradeState = {
  inputAsset: '',
  outputAsset: '',
};

const actions = {
  init({ commit }) {
    commit(
      'setInputAsset',
      lsGet(
        `trade.inputAsset.${networkId.value}`,
        initialTokens[networkId.value].input
      )
    );
    commit(
      'setOutputAsset',
      lsGet(
        `trade.outputAsset.${networkId.value}`,
        initialTokens[networkId.value].output
      )
    );
  },
};

const mutations = {
  setInputAsset(state: TradeState, asset: string): void {
    state.inputAsset = asset;
    lsSet(`trade.inputAsset.${networkId.value}`, asset);
  },

  setOutputAsset(state: TradeState, asset: string): void {
    state.outputAsset = asset;
    lsSet(`trade.outputAsset.${networkId.value}`, asset);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

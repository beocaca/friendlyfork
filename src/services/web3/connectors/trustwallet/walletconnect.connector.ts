import WalletConnectProvider from '@walletconnect/web3-provider';

import ConfigService from '@/services/config/config.service';
import { WalletError } from '@/types';
import { Network } from '@balancer-labs/sdk';
import { Connector, ConnectorId } from '../connector';

export class WalletConnectConnector extends Connector {
  id = ConnectorId.WalletConnect;
  async connect() {
    const configService = new ConfigService();
    const provider = new WalletConnectProvider({
      rpc: {
        [Network.MAINNET]: configService.getNetworkRpc(Network.MAINNET),
        [Network.POLYGON]: configService.getNetworkRpc(Network.POLYGON),
        [Network.ARBITRUM]: configService.getNetworkRpc(Network.ARBITRUM),
        [Network.GOERLI]: configService.getNetworkRpc(Network.GOERLI),
      },
    });
    this.provider = provider;

    try {
      const accounts = await provider.enable();

      const chainId = await provider.request({ method: 'eth_chainId' });
      this.handleChainChanged(chainId);
      this.handleAccountsChanged(accounts);
    } catch (err) {
      if ((err as WalletError).code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to WalletConnect.');
      } else {
        console.error(err);
      }
    }
    return {
      // TODO type this
      provider: provider as any,
      account: this.account,
      chainId: this.chainId,
    };
  }
}

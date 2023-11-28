import { useState } from 'react';
import { Divider, Button, Input } from 'antd';
// @ts-ignore
import bitcoinCashJs from 'bitcoincashjs-lib';
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { getPkhfromPk } from '@taquito/utils';

async function createWalletFromMnemonic(mnemonic: string) {
  const tezos = new TezosToolkit('https://your-tezos-node-url');
  const signer = await InMemorySigner.fromMnemonic({ mnemonic });

  tezos.setProvider({ signer });

  const publicKey = await signer.publicKey();
  const publicKeyHash = await signer.publicKeyHash(); // 这是Tezos地址

  return { publicKey, address: publicKeyHash };
}

function Tezos({ mnemonic }: { mnemonic: string }) {
  const [address, setAddress] = useState<undefined | string>('');
  const [publicKey, setPublicKey] = useState('');
  const importWallet = async () => {
    const wallet = await createWalletFromMnemonic(mnemonic);
    // setExtendedKey(extendedKey);
    const publicKeyHex = wallet.publicKey;
    setPublicKey(publicKeyHex);
    setAddress(wallet.address);
  };
  const publicKeyToAddress = async () => {
    // 计算公钥哈希，即Tezos地址
    const address = getPkhfromPk(publicKey);
    setAddress(address);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 500,
      }}
    >
      <h3>Tezos</h3>
      <Button
        style={{ marginTop: 10, width: '100%' }}
        onClick={() => importWallet()}
      >
        导入钱包
      </Button>
      <div style={{ width: '100%', wordWrap: 'break-word' }}>
        <p>
          address
          <Input
            style={{ width: '100%', marginTop: 10 }}
            placeholder="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </p>
        <p>
          publicKey
          <Input
            style={{ width: '100%', marginTop: 10 }}
            placeholder="publicKey"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
        </p>
        <Button
          style={{ marginTop: 10, width: '100%' }}
          onClick={publicKeyToAddress}
        >
          通过 publicKey 推导出 address
        </Button>
      </div>
      <Divider />
    </div>
  );
}

export default Tezos;

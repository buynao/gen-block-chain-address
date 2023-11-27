import { useState } from 'react';
import { Divider, Button, Input } from 'antd';
// @ts-ignore
import * as bitcoin from 'bitcoinjs-lib';
// @ts-ignore
import * as bitcoinCashJs from 'bitcoincashjs-lib';
import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Keyring } from '@polkadot/api';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  encodeAddress,
} from '@polkadot/util-crypto';

async function createWalletFromMnemonic(mnemonic: string) {
  // 使用助记词创建钱包
  const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 }); // Kusama的ss58格式为2
  const wallet = keyring.addFromMnemonic(mnemonic);

  // 获取公钥和地址
  const publicKey = wallet.publicKey;
  const address = wallet.address;

  return { publicKey, address };
}

function Kusama({ mnemonic }: { mnemonic: string }) {
  const [address, setAddress] = useState<string | undefined>('');
  const [publicKey, setPublicKey] = useState<string | undefined>();
  const importWallet = async () => {
    const wallet = await createWalletFromMnemonic(mnemonic);
    // setExtendedKey(extendedKey);
    const publicKeyHex = Buffer.from(wallet.publicKey).toString('hex');
    setPublicKey(publicKeyHex);
    setAddress(wallet.address);
  };
  const publicKeyToAddress = () => {
    // @ts-ignore
    const ss58Format = 2;
    const address = encodeAddress(('0x' + publicKey) as string, ss58Format);
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
      <h3>Kusama</h3>
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

export default Kusama;

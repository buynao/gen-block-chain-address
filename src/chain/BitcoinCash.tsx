import { useState } from 'react';
import { Divider, Button, Input } from 'antd';
// @ts-ignore
import bitcoinCashJs from 'bitcoincashjs-lib';
import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
const bip32 = BIP32Factory(ecc);
function getAddress(node: any, network?: any): string {
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
}
async function createWalletFromMnemonic(mnemonic: string) {
  // 确保助记词是有效的
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bitcoinCashJs.HDNode.fromSeedBuffer(
    seed,
    bitcoinCashJs.networks.bitcoin,
  );
  // 通常使用的路径是 "m/44'/145'/0'"
  const path = "m/44'/145'/0'/0/0";
  const child = root.derivePath(path);
  console.log('>>>>>child', child);
  const xpub = child.neutered().toBase58();
  // 获取Bitcoin Cash地址
  const address = child.getAddress();
  const publicKeyHex = child.getPublicKeyBuffer().toString('hex');
  return { publicKey: publicKeyHex, address, xpub };
}

function BitcoinCash({ mnemonic }: { mnemonic: string }) {
  const [address, setAddress] = useState<undefined | string>('');
  const [publicKey, setPublicKey] = useState('');
  const importWallet = async () => {
    const wallet = await createWalletFromMnemonic(mnemonic);
    // setExtendedKey(extendedKey);
    const publicKeyHex = wallet.publicKey;
    setPublicKey(publicKeyHex);
    setAddress(wallet.address);
  };
  const publicKeyToAddress = () => {
    // @ts-ignore
    const publicKeyBuffer = window.Buffer.from(publicKey, 'hex');
    const { address } = bitcoin.payments.p2pkh({
      pubkey: publicKeyBuffer,
      network: bitcoinCashJs.networks.bitcoin,
    });
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
      <h3>BitcoinCash</h3>
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

export default BitcoinCash;

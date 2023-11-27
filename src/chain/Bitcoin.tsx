import { useState } from 'react';
import { Divider, Button, Input } from 'antd';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { BIP32Interface } from 'bip32';
const bip32 = BIP32Factory(ecc);
function getAddress(node: any, network?: any): string {
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
}

function Bitcoin({ mnemonic }: { mnemonic: string }) {
  const [address, setAddress] = useState<undefined | string>('');
  const [extendedKey, setExtendedKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [wallet, setWallet] = useState<BIP32Interface | null>(null);
  const [derivePath, setDerivePath] = useState('');
  const importWallet = () => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed);
    const extendedKey = node.neutered().toBase58();
    const publicKey = node.publicKey.toString('hex');
    // const strng = node.toBase58();
    // const restored = bip32.fromBase58(strng);
    // @ts-ignore
    setWallet(node);
    setExtendedKey(extendedKey);
    setPublicKey(publicKey);
    setAddress(getAddress(node));
  };
  const publicKeyToAddress = () => {
    // @ts-ignore
    const publicKeyBuffer = window.Buffer.from(publicKey, 'hex');
    const { address } = bitcoin.payments.p2pkh({
      pubkey: publicKeyBuffer,
      network: bitcoin.networks.bitcoin,
    });
    setAddress(address);
  };
  const deriveAddress = () => {
    if (wallet && derivePath) {
      const derivedWallet = wallet.derivePath(derivePath);
      setAddress(getAddress(derivedWallet));
    }
  };
  console.log('wallet', wallet);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 500,
      }}
    >
      <h3>Bitcoin</h3>
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
          extendedKey：
          <Input
            style={{ width: '100%', marginTop: 10 }}
            placeholder="extendedKey"
            value={extendedKey}
            onChange={(e) => setExtendedKey(e.target.value)}
          />
        </p>
        <Input
          style={{ width: '100%', marginTop: 10 }}
          placeholder="输入地址路径"
          value={derivePath}
          onChange={(e) => setDerivePath(e.target.value)}
        />
        <Button
          style={{ marginTop: 10, width: '100%' }}
          onClick={deriveAddress}
        >
          通过 xpub + derive path 推导出 address
        </Button>
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

export default Bitcoin;

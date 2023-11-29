import { useState } from 'react';
import { Divider, Button, Input } from 'antd';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory, ECPairAPI, ECPairInterface } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';
const path = "m/44'/0'/0'/0/0";

const ECPair: ECPairAPI = ECPairFactory(tinysecp);
const bip32 = BIP32Factory(ecc);
function getAddress(node: any, network?: any): string {
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address!;
}

function Bitcoin({ mnemonic }: { mnemonic: string }) {
  const [address, setAddress] = useState<undefined | string>('');
  // const [extendedKey, setExtendedKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [wallet, setWallet] = useState<ECPairInterface | null>(null);
  const [root, setRoot] = useState<any | null>(null);
  // const [derivePath, setDerivePath] = useState('');
  const importWallet = () => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);
    const node = root.derivePath(path);
    console.log('>>>>>>>node', node);
    const signer = ECPair.fromPublicKey(node.publicKey);
    // const strng = node.toBase58();
    // const restored = bip32.fromBase58(strng);
    console.log('>>>>>>>signer', signer);
    // @ts-ignore
    setRoot(root);
    setWallet(signer);
    // setExtendedKey(extendedKey);
    setPublicKey(signer.publicKey.toString('hex'));
    setAddress(getAddress(signer, bitcoin.networks.bitcoin));
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
  const publicKeyToAddress1 = () => {
    // @ts-ignore
    const publicKeyBuffer = window.Buffer.from(publicKey, 'hex');
    const p2wpkh = bitcoin.payments.p2pkh({
      pubkey: publicKeyBuffer,
      network: bitcoin.networks.bitcoin,
    });
    const { address } = bitcoin.payments.p2sh({ redeem: p2wpkh });

    setAddress(address);
  };
  const publicKeyToAddress2 = () => {
    // @ts-ignore
    const path1 = `m/84'/0'/0'/0/0`;
    const node = root?.derivePath(path1);
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: node.publicKey,
      network: bitcoin.networks.bitcoin,
    });

    setAddress(address);
  };
  // const deriveAddress = () => {
  //   if (wallet && derivePath) {
  //     const derivedWallet = wallet.derivePath(derivePath);
  //     setAddress(getAddress(derivedWallet));
  //   }
  // };
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
        {/* <p>
          extendedKey：
          <Input
            style={{ width: '100%', marginTop: 10 }}
            placeholder="extendedKey"
            value={extendedKey}
            onChange={(e) => setExtendedKey(e.target.value)}
          />
        </p> */}
        {/* <Input
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
        </Button> */}
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
          通过 publicKey 推导出 legacy address
        </Button>
        <Button
          style={{ marginTop: 10, width: '100%' }}
          onClick={publicKeyToAddress1}
        >
          通过 publicKey 推导 segwit (compatible)
        </Button>
        <Button
          style={{ marginTop: 10, width: '100%' }}
          onClick={publicKeyToAddress2}
        >
          通过 publicKey 推导 segwit (native)
        </Button>
      </div>
      <Divider />
    </div>
  );
}

export default Bitcoin;

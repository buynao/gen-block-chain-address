import { useState } from 'react';
import { Divider, Button, Input } from 'antd';
import CKB from '@nervosnetwork/ckb-sdk-core';
import { mnemonicToSeedSync } from 'bip39';
import HDKey from 'hdkey';

async function createWalletFromMnemonic(mnemonic: string) {
  const seed = mnemonicToSeedSync(mnemonic);
  const hdkey = HDKey.fromMasterSeed(seed);
  const path = "m/44'/309'/0'/0/0";
  const derivedKey = hdkey.derive(path);
  const publicKey = derivedKey.publicKey;
  const publicKeyHex = Buffer.from(publicKey).toString('hex');
  const address = new CKB().utils.pubkeyToAddress('0x' + publicKeyHex);
  return { publicKey, address };
}

function Nervos({ mnemonic }: { mnemonic: string }) {
  const [address, setAddress] = useState<undefined | string>('');
  const [publicKey, setPublicKey] = useState('');
  const importWallet = async () => {
    const wallet = await createWalletFromMnemonic(mnemonic);
    // setExtendedKey(extendedKey);
    const publicKeyHex = Buffer.from(wallet.publicKey).toString('hex');
    setPublicKey('0x' + publicKeyHex);
    setAddress(wallet.address);
  };
  const publicKeyToAddress = async () => {
    const address = new CKB().utils.pubkeyToAddress(publicKey);
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
      <h3>Nervos</h3>
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

export default Nervos;

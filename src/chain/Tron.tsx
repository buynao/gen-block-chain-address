import { useState } from 'react';
import { Divider, Button, Input } from 'antd';
// @ts-ignore
import TronWeb from 'tronweb';

function publicKeyToTronAddress(publicKeyHex: Buffer) {
  const addressBytes = TronWeb.utils.crypto.computeAddress(publicKeyHex);
  const base58Address =
    TronWeb.utils.crypto.getBase58CheckAddress(addressBytes);
  return base58Address;
}
async function createWalletFromMnemonic(mnemonic: string) {
  const tronWeb = new TronWeb({
    fullHost: 'http://api.trongrid.io', // 使用TronGrid的API
    privateKey: '', // 在初始化时不需要私钥
  });
  console.log('>>>>>>>fromMnemonic', mnemonic);
  const account = await tronWeb.fromMnemonic(mnemonic);
  console.log('>>>>>>>account', account);
  return account;
}
function Tron({ mnemonic }: { mnemonic: string }) {
  const [address, setAddress] = useState<undefined | string>('');
  const [extendedKey, setExtendedKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [wallet, setWallet] = useState<null>(null);
  const [derivePath, setDerivePath] = useState('');
  const importWallet = async () => {
    const wallet = await createWalletFromMnemonic(mnemonic);
    setWallet(wallet);
    // setExtendedKey(extendedKey);
    setPublicKey(wallet.publicKey);
    setAddress(wallet.address);
  };
  const publicKeyToAddress = () => {
    // @ts-ignore
    const publicKeyBuffer = window.Buffer.from(
      publicKey.replace('0x', ''),
      'hex',
    );
    const address = publicKeyToTronAddress(publicKeyBuffer);
    console.log('>TronWeb.isAddress(address)', TronWeb.isAddress(address));
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
      <h3>Tron</h3>
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

export default Tron;

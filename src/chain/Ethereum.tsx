import { useState } from 'react';
import { Divider, Button, Input } from 'antd';
import { utils } from 'ethers';
const txStr = {
  to: '0xE6F4142dfFA574D1d9f18770BF73814df07931F3',
  nonce: 6,
  gasLimit: 21000,
  value: 0,
  chainId: 5,
  type: 2,
  maxFeePerGas: 18,
  maxPriorityFeePerGas: 2,
  accessList: [],
};
function Ethereum({ mnemonic }: { mnemonic : string}) {
  const [address, setAddress] = useState<undefined | string>('');
  const [extendedKey, setExtendedKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [wallet, setWallet] = useState<utils.HDNode | null>(null);
  const [derivePath, setDerivePath] = useState('');
  const importWallet = () => {
    const HDWallet = utils.HDNode.fromMnemonic(mnemonic, '');
    const derivationPath = "m/44'/60'/0'/0/0"; // 以太坊的标准派生路径
    const childNode = HDWallet.derivePath(derivationPath);
    setWallet(childNode);
    setExtendedKey(childNode.extendedKey);
    setPublicKey(childNode.publicKey);
    setAddress(childNode.address);
  };
  const publicKeyToAddress = () => {
    const address = utils.computeAddress(publicKey);
    setAddress(address);
  };
  const deriveAddress = () => {
    if (wallet && derivePath) {
      const derivedWallet = wallet.derivePath(derivePath);
      setAddress(derivedWallet.address);
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
      <h3>Ethereum</h3>
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
      {/* {wallet && (
        <div style={{ width: '100%', wordWrap: 'break-word' }}>
          <p>使用 Wallet 签署 Transaction</p>
          <Input.TextArea
            value={JSON.stringify(tx, null, 2)}
            onChange={(e) => {
              if (e.target.value) {
                try {
                  const txStr = JSON.parse(e.target.value);
                  setTx(txStr);
                } catch (e) {
                  console.log('>>>>>e', e);
                }
              }
            }}
            style={{ height: 280, resize: 'none', width: '100%' }}
          />
          <p>unsignedHash: {transaction?.unsignedHash}</p>
          {msg && <p>sign result: {msg}</p>}
          <Button
            style={{ marginTop: 10, width: '100%' }}
            onClick={() => onSignMessage()}
            loading={loading}
          >
            签名
          </Button>
        </div>
      )} */}
      <Divider />
    </div>
  );
}

export default Ethereum;

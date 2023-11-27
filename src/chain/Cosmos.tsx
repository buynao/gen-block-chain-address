import { useState } from 'react';
import { Divider, Button, Input } from 'antd';

import { Secp256k1HdWallet, pubkeyToAddress } from '@cosmjs/amino';
import { stringToPath } from '@cosmjs/crypto';

async function createWalletFromMnemonic(mnemonic: string) {
  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: 'cosmos', // 根据需要使用的Cosmos网络前缀
    hdPaths: [stringToPath("m/44'/118'/0'/0/0")], // Cosmos标准路径
  });

  const accounts = await wallet.getAccounts();
  return accounts[0]; // 返回第一个账户信息
}

function Cosmos({ mnemonic }: { mnemonic: string }) {
  const [address, setAddress] = useState<undefined | string>('');
  const [publicKey, setPublicKey] = useState('');
  const importWallet = async () => {
    const wallet = await createWalletFromMnemonic(mnemonic);
    console.log('>>>>>>wallet', wallet);
    // setExtendedKey(extendedKey);
    const publicKeyHex = Buffer.from(wallet.pubkey).toString('hex');
    setPublicKey(publicKeyHex);
    setAddress(wallet.address);
  };
  const publicKeyToAddress = async () => {
    const address = await getAddressFromPublicKey(publicKey, 'cosmos');
    setAddress(address);
  };
  async function getAddressFromPublicKey(publicKeyHex: string, prefix: string) {
    // 将公钥的十六进制字符串转换为Uint8Array
    // const publicKeyBytes = Uint8Array.from(Buffer.from(publicKeyHex, 'hex'));

    // 使用pubkeyToAddress方法从公钥生成地址
    const address = pubkeyToAddress(
      {
        type: 'tendermint/PubKeySecp256k1',
        value: Buffer.from(publicKeyHex, 'hex').toString('base64'),
      },
      prefix,
    );
    // 将地址编码为Bech32格式
    return address;
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 500,
      }}
    >
      <h3>Cosmos</h3>
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

export default Cosmos;

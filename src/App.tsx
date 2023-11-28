import './App.css';
import { useState } from 'react';
import {
  Ethereum,
  Bitcoin,
  Tron,
  Cosmos,
  Nervos,
  BitcoinCash,
  Litecoin,
  Kusama,
  Polkadot,
  Tezos,
} from './chain/index';
import { Input } from 'antd';

import { Select } from 'antd';
const { Option } = Select;

function App() {
  const defaultMnemonic = '';
  const [mnemonic, setMnemonic] = useState(defaultMnemonic);
  const [selectedChain, setSelectedChain] = useState('Ethereum');

  const handleChainChange = (chain: string) => {
    setSelectedChain(chain);
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
      <Select
        defaultValue="Ethereum"
        style={{ width: 120 }}
        onChange={handleChainChange}
      >
        <Option value="Ethereum">Ethereum</Option>
        <Option value="Bitcoin">Bitcoin</Option>
        <Option value="Tron">Tron</Option>
        <Option value="Cosmos">Cosmos</Option>
        <Option value="Nervos">Nervos</Option>
        <Option value="BitcoinCash">BitcoinCash</Option>
        <Option value="Litecoin">Litecoin</Option>
        <Option value="Kusama">Kusama</Option>
        <Option value="Polkadot">Polkadot</Option>
        <Option value="Tezos">Tezos</Option>
      </Select>
      <Input
        style={{ width: '100%', marginTop: 20 }}
        placeholder="输入助记词"
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
      />
      {selectedChain === 'Ethereum' && <Ethereum mnemonic={mnemonic} />}
      {selectedChain === 'Bitcoin' && <Bitcoin mnemonic={mnemonic} />}
      {selectedChain === 'Tron' && <Tron mnemonic={mnemonic} />}
      {selectedChain === 'Cosmos' && <Cosmos mnemonic={mnemonic} />}
      {selectedChain === 'Nervos' && <Nervos mnemonic={mnemonic} />}
      {selectedChain === 'BitcoinCash' && <BitcoinCash mnemonic={mnemonic} />}
      {selectedChain === 'Litecoin' && <Litecoin mnemonic={mnemonic} />}
      {selectedChain === 'Kusama' && <Kusama mnemonic={mnemonic} />}
      {selectedChain === 'Polkadot' && <Polkadot mnemonic={mnemonic} />}
      {selectedChain === 'Tezos' && <Tezos mnemonic={mnemonic} />}
    </div>
  );
}

export default App;

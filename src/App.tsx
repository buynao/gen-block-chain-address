import './App.css';
import { useState } from 'react';
import { Ethereum, Bitcoin, Tron, Cosmos } from './chain/index';
import { Input } from 'antd';

import { Select } from 'antd';
const { Option } = Select;

function App() {
  const mnemonicStr =
    'hope scan cruel dizzy slender pass final defy south subject title crush';
  const [mnemonic, setMnemonic] = useState(mnemonicStr);
  const [chain, setChain] = useState('Ethereum');

  const handleChange = (value: string) => {
    setChain(value);
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
      <Input
        style={{ width: '100%' }}
        placeholder="输入助记词"
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
      />
      <Select
        defaultValue="Ethereum"
        style={{ width: 120, marginTop: 20 }}
        onChange={handleChange}
      >
        <Option value="Ethereum">Ethereum</Option>
        <Option value="Bitcoin">Bitcoin</Option>
        <Option value="Tron">Tron</Option>
        <Option value="Cosmos">Cosmos</Option>
      </Select>
      {chain === 'Ethereum' && <Ethereum mnemonic={mnemonic} />}
      {chain === 'Bitcoin' && <Bitcoin mnemonic={mnemonic} />}
      {chain === 'Tron' && <Tron mnemonic={mnemonic} />}
      {chain === 'Cosmos' && <Cosmos mnemonic={mnemonic} />}
    </div>
  );
}

export default App;

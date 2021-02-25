import React from 'react';
import { BasicSelect } from './Basic-Select/Basic-Select.component';
import './App.css';

function App() {
  return (
    <div className="App">
      <BasicSelect
        options={[
          { value: '1', display: '1' },
          { value: '2', display: '2' },
          { value: '3', display: '3' }
        ]}
        placeholder={'Hellow World!'}
        value={'1'}
        labelText={'Basic Select Label'}
        name={'Basic Select'}
        id={'basic-select'}
        // validationMessage={'Please select an option'}
        onChange={() => { }}
        onBlur={() => { }}
        onKeyDown={() => { }}
      />


      <select>
        <option disabled={true}>Placeholder</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>


    </div>
  );
}

export default App;

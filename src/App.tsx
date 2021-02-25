import React from 'react';
import { BasicSelect } from './Basic-Select/Basic-Select.component';
import './App.css';

function App() {
  return (
    <div>
      <div style={{ maxWidth: '700px', marginBottom: '70px' }}>
        <h1>Custom Select Demo</h1>

        <h2>Problem: Select cannot be styled very well</h2>
        <p>
          It is a well documented fact that browser platforms are srely lacking
          when it comes to affording developers the ability to style
          HTML5 select elements, and all of their parts and pieces including the down arrow,
          drop down menu and drop down menu items.
        </p>
        <p>
          <a href="https://github.com/alexUXUI/basic-select">This project</a>{" "}
          Is a study of what it would look like to create a custom implementation of
          a native select element
        </p>

      </div>

      <div className="App">
        <BasicSelect
          options={[
            { value: '1', display: '1' },
            { value: '2', display: '2' },
            { value: '3', display: '3' }
          ]}
          placeholder={'Hello World!'}
          value={''}
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

    </div>
  );
}

export default App;

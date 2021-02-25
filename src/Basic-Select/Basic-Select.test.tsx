import { BasicSelect } from "./Basic-Select.component"
import { fireEvent, render } from '@testing-library/react'
import userEvent from "@testing-library/user-event"

describe('<BasicSelect /> test suite', () => {
    it('Renders and has the correct components', () => {
        const { container, getByTestId } = render(
            <BasicSelect
                options={[
                    { value: 'hello', display: 'world' },
                    { value: 'hola', display: 'mars' }
                ]}
                placeholder={'Hello World!'}
                value={''}
                labelText={'Basic Select Label'}
                name={'Basic Select'}
                id={'basic-select'}
                onChange={() => { }}
                onBlur={() => { }}
                onKeyDown={() => { }}
            />
        )

        const basicSelect = getByTestId('basic-select')
        const placeholder = getByTestId('basic-select__placeholder')
        const dropDownArrow = getByTestId('drop-down-arrow')

        expect(placeholder.textContent).toBe('Hello World!')

        userEvent.tab()

        // expect(basicSelect).toHaveFocus()

        fireEvent.keyDown(basicSelect, { key: 'Enter', code: 'Enter' })

        const dropDownMenu = getByTestId("basic-select__menu")

        fireEvent.keyDown(basicSelect, { key: ' ', code: 'Space' })

        expect(dropDownMenu).not.toBeInTheDocument()
    })
})
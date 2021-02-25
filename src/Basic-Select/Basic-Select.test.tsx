import { BasicSelect } from "./Basic-Select.component"
import { fireEvent, render } from '@testing-library/react'
import userEvent from "@testing-library/user-event"

describe('<BasicSelect /> test suite', () => {
    it('Renders and has all the correct components / parts', () => {
        const { getByTestId } = render(
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
        );

        const placeholder = getByTestId('basic-select__placeholder')
        getByTestId('basic-select')
        getByTestId('drop-down-arrow')

        expect(placeholder.textContent).toBe('Hello World!')
    })

    it('Drop down menu is not visibile on render but can be opened / closed on click', () => {
        const { getByTestId } = render(
            <>
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
                    onChange={() => { }}
                    onBlur={() => { }}
                    onKeyDown={() => { }}
                />
                <div data-testid="outside-element">Random Div to register click event outside of modal drop down</div>
            </>
        );

        // Get a ref to <BasicSelect />
        const basicSelectRoot = getByTestId('basic-select')

        // Assert the drop down menu is not open / nowhere to be found / not mounted to DOM
        expect(document.querySelector('[data-testid=basic-select__menu]')).toBeFalsy()

        // Click on the <BasicSelect /> component
        fireEvent.click(basicSelectRoot)

        // Assert that the menu is now mounted to the DOM
        expect(document.querySelector('[data-testid=basic-select__menu]')).toBeTruthy()

        // Get a ref to a element outside of <BasicSelect /> that we can click on
        const elementOutsideBasicSelect = getByTestId('outside-element')

        // Click on the outside element
        fireEvent.click(elementOutsideBasicSelect)

        // Assert that the menu is unmounted to the DOM again
        expect(document.querySelector('[data-testid=basic-select__menu]')).toBeFalsy()
    })

    it('Displays options if options are passed and menu is open', () => {
        const { getByTestId, getAllByTestId } = render(
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
                onChange={() => { }}
                onBlur={() => { }}
                onKeyDown={() => { }}
            />
        );

        // Get a reference to the <BasicSelect /> component
        const basicSelect = getByTestId('basic-select');

        // Fire a tab button press to get focus on <BasicSelect />
        userEvent.tab();

        // Fire a Spacebar keydown event to open the dropdown menu
        fireEvent.keyDown(basicSelect, { key: " " });

        // Search the DOM for the existance of the menu and a menu item
        const basicSelectMenu = getByTestId('basic-select__menu')
        const basicSelectMenuItems = getAllByTestId('basic-select__menu-item')

        // Assert that the correct number of menu items are showing
        expect(basicSelectMenuItems.length).toBe(3)

        // Assert that the menu is showing the correct display text
        expect(basicSelectMenu.textContent).toBe("123")

        // Assert that the list item is displaying the correct text content
        expect(basicSelectMenuItems[0].textContent).toBe("1")
    })

    it('User can naviagte with a keyboard', () => {
        const { getByTestId, getAllByTestId } = render(
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
                onChange={() => { }}
                onBlur={() => { }}
                onKeyDown={() => { }}
            />
        );

        const basicSelect = getByTestId('basic-select');

        userEvent.tab();

        fireEvent.keyDown(basicSelect, { key: " " });

        const basicSelectMenu = getByTestId('basic-select__menu')
        const basicSelectMenuItems = getAllByTestId('basic-select__menu-item')

        expect(basicSelectMenuItems.length).toBe(3)

        const firstMenuItem = basicSelectMenuItems[0]
        const secondMenuItem = basicSelectMenuItems[1]

        let currentlyFocusedElement = document.activeElement;

        expect(currentlyFocusedElement).toBe(firstMenuItem)

        fireEvent.keyDown(currentlyFocusedElement!, { key: 'ArrowDown', code: 'ArrowDown' })

        let newlyFocusedElement = document.activeElement;

        expect(newlyFocusedElement).toBe(secondMenuItem)
    })
})
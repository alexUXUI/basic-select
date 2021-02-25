import { FC, SyntheticEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import {
    StyledBasicSelect,
    StyledPlaceholder,
    StyledDownArrowWrapper,
    StyledPlaceHolderWrapper,
    StyledMenuItem,
    StyledMenu
} from './Basic-Select.styled'

export interface Option {
    value: string
    display: string
}

export interface BasicSelectProps {
    options: Option[]
    placeholder?: string
    value?: string | number | string[]
    labelText: string
    name: string
    id: string
    validationMessage?: string
    onChange?: (value: any) => void
    onBlur?: () => void
    onKeyDown?: () => void
}

export const BasicSelect: FC<BasicSelectProps> = ({
    options,
    placeholder,
    value,
    labelText,
    name,
    id,
    validationMessage,
    onChange,
    onBlur,
    onKeyDown,
}): JSX.Element => {

    /**
     * Local state
     * 1) isOpen = is the drop down menu open?
     * 2) selectedOption = is there a selected option?
     */
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<Option | undefined>(undefined);

    // root DOM node of entire component
    const basicSelectRef = useRef<HTMLDivElement>(null);

    // DOM node for the menu
    const menuRef = useRef<HTMLDivElement>(null);

    // DOM node for currently focused list item
    const focusedListItemRef = useRef<HTMLLIElement>(null);

    // toggles open and closed
    const keysThatToggleMenu = [" ", "Enter"];

    /**
     * This effect adds the event listeners to the DOM
     * 1) listener for clicks to close the menu if user clicks outside
     * 2) listener for keydown events to enable keyboard nav
     */
    useLayoutEffect(() => {
        document.addEventListener('click', handleDocumentClicks, false);
        document.addEventListener('keydown', handleDocumentKeydowns, false);

        return () => {
            document.removeEventListener('click', handleDocumentClicks, false);
            document.removeEventListener('keydown', handleDocumentKeydowns, false);
        }
    }, [isOpen])

    /**
     * This effect sets the default value of the dropdown if the user 
     * specifices one through the props
     */
    useLayoutEffect(() => {
        if (value) {
            const defaultValueFromProps = options.filter((option: Option) => option.value == value)
            setSelectedOption(defaultValueFromProps[0])
        }
    }, [value])

    /**
     * This effect puts the focus on the correct list item 
     * when the drop down menu is opened. If a value was previously
     * selected, this will put the focus on that element. If not, this
     * will put the focus on the first element in the list. When the menu
     * is closed, this effect makes sure to return the focus back on the root.
     */
    useEffect(() => {
        if (isOpen) {
            const listHasAtLeastOneItem = focusedListItemRef && focusedListItemRef.current;

            if (listHasAtLeastOneItem) {
                focusedListItemRef?.current?.focus()
            }
        } else {
            if (selectedOption && basicSelectRef && basicSelectRef.current) {
                basicSelectRef.current.focus()
            }
        }
    }, [isOpen])

    /**
     * This click handler makes sure that if the user clicks outside the
     * menu while it is open, the menu closes. It also ensures that clicks
     * inside the drop down do not close the menu
     */
    const handleDocumentClicks = (e: MouseEvent) => {
        const { target } = e;

        if (!isOpen) {
            const userClickedInside = basicSelectRef?.current?.contains(target as Node)

            if (userClickedInside && !isOpen) {
                setIsOpen(true)
            }
        }

        if (isOpen) {
            const userClickedOutside = !menuRef?.current?.contains(target as Node)

            if (userClickedOutside) {
                setIsOpen(false)
            }
        }
    }

    /**
     * This keydown handler helps ensure  
     * that the user can use the arrow keys to naviagte the options
     * it also makes sure that Escape key closes the menu and that Tab key
     * does not work inside the menu while it is open. This is default <select /> behavior.
     */
    // TODO find an event type that has nextSibling on it 🤔
    const handleDocumentKeydowns = (e: any) => {
        if (isOpen) {

            onKeyDown && onKeyDown()

            switch (e.key) {
                case "Escape": {
                    e.preventDefault();
                    setIsOpen(false);
                    break;
                }
                case "Tab": {
                    e.preventDefault();
                    break;
                }
                case "ArrowDown": {
                    if (e && e.target && e.target.nextSibling) {
                        e.target.nextSibling.focus();
                    }
                    break;
                }
                case "ArrowUp": {
                    if (e && e.target && e.target.previousSibling) {
                        e.target.previousSibling.focus()
                    }
                    break;
                }
            }
        }
    }

    /**
     * This key down handler is specific to the root node. 
     * it ensures that the menu opens if the user presses any
     * key that toggles the menu while the focus is on the root node
     */
    const handleKeyDown = ({ key: pressedKey }: { key: string }): void => {
        if (keysThatToggleMenu.includes(pressedKey)) {
            setIsOpen(!isOpen)
        }
    }

    // Helper funciton to set a selected value and close the drop down
    const setSelectedAndClose = (option: Option) => {
        setSelectedOption(option)
        onChange && onChange(option)
        setIsOpen(false)
    }

    // handle blur just calls whatever the user passes through props
    const handleBlur = (e: SyntheticEvent) => {
        e.preventDefault();
        onBlur && onBlur();
    }

    return (
        <StyledBasicSelect
            ref={basicSelectRef}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            id={id}
        >
            {
                /**
                 * what the user sees / what is always visible
                 * doesnt matter about the open / closed state
                 * 1) wrapper with borders
                 * 2) Placeholder
                 * 3) Selected value
                 * 4) Down arrow
                 */
            }

            <StyledPlaceHolderWrapper>
                <StyledPlaceholder>
                    {selectedOption != undefined ? selectedOption.display : placeholder}
                    <StyledDownArrowWrapper>
                        <BiChevronDown />
                    </StyledDownArrowWrapper>
                </StyledPlaceholder>
            </StyledPlaceHolderWrapper>

            {
                /**
                 * What the user does not initially see.
                 * Matters if the menu is open or closed.
                 * Consists of:
                 * 1) Drop down menu list <BasicSelectMenu />
                 * 2) Drop down menu list items <BasicSelectListItemProps />
                 */
            }
            <BasicSelectMenu
                isOpen={isOpen}
                options={options}
                selectedOption={selectedOption ? selectedOption : undefined}
                focusedListItemRef={focusedListItemRef}
                setSelectedAndClose={setSelectedAndClose}
                keysThatToggleMenu={keysThatToggleMenu}
            />
            {
                validationMessage
                    ? (
                        <span
                            data-testid="basic-select__validation-message"
                        >
                            {validationMessage}
                        </span>
                    )
                    : null
            }
        </StyledBasicSelect>
    )
}

export interface BasicSelectMenuProps {
    isOpen: boolean
    options: Option[]
    selectedOption: Option | undefined
    focusedListItemRef: React.RefObject<HTMLLIElement>
    setSelectedAndClose: (option: Option) => void
    keysThatToggleMenu: string[]
}

export const BasicSelectMenu: FC<BasicSelectMenuProps> = ({
    isOpen,
    options,
    selectedOption,
    focusedListItemRef,
    setSelectedAndClose,
    keysThatToggleMenu
}): JSX.Element | null => {

    let hasOptionsToShow = options && options.length;

    if (isOpen && hasOptionsToShow) {
        return (
            <StyledMenu data-testid="basic-select__menu">
                {
                    options.map((option, i) => {
                        let listItemHasFocus = Boolean(selectedOption && selectedOption.value === option.value || i === 0)

                        return (
                            <BasicSelectListItem
                                listItemHasFocus={listItemHasFocus}
                                focusedListItemRef={focusedListItemRef}
                                setSelectedAndClose={setSelectedAndClose}
                                keysThatToggleMenu={keysThatToggleMenu}
                                option={option}
                                key={i}
                            />
                        )
                    })
                }
            </StyledMenu>
        )
    }

    return null
}

export interface BasicSelectListItemProps {
    option: Option
    listItemHasFocus: boolean
    focusedListItemRef: React.RefObject<HTMLLIElement>
    setSelectedAndClose: (option: Option) => void
    keysThatToggleMenu: string[]
}

export const BasicSelectListItem: FC<BasicSelectListItemProps> = ({
    listItemHasFocus,
    focusedListItemRef,
    setSelectedAndClose,
    keysThatToggleMenu,
    option,
}): JSX.Element => {
    return (
        <StyledMenuItem
            tabIndex={0}
            ref={listItemHasFocus ? focusedListItemRef : null}
            onClick={(e) => {
                e.preventDefault()
                setSelectedAndClose(option)
            }}
            onKeyDown={({ key }) => {
                if (keysThatToggleMenu.includes(key)) {
                    setSelectedAndClose(option)
                }
            }}
        >
            {option.display}
        </StyledMenuItem>
    )
}
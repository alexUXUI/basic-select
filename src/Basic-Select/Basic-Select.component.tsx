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

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<Option | undefined>(undefined);

    const basicSelectRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const focusedListItemRef = useRef<HTMLLIElement>(null);

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
     * This effect sets the current value of the dropdown if the user 
     * specifices one through the props
     */
    useLayoutEffect(() => {
        if (value) {
            const currentValue = options.filter((option: Option) => option.value == value)
            setSelectedOption(currentValue[0])
        }
    }, [value])

    /**
     * This effect puts the focus on the correct list item 
     * when the drop down menu is opened. If a value was previously
     * selected, this will put the focus on that element. If not, this
     * will put the focus on the first element in the list
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

    const handleKeyDown = ({ key: pressedKey }: { key: string }): void => {
        if (keysThatToggleMenu.includes(pressedKey)) {
            setIsOpen(!isOpen)
        }
    }

    const setSelectedAndClose = (option: Option) => {
        setSelectedOption(option)
        onChange && onChange(option)
        setIsOpen(false)
    }

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
            <StyledPlaceHolderWrapper>
                <StyledPlaceholder>
                    {selectedOption != undefined ? selectedOption.display : placeholder}
                    <StyledDownArrowWrapper>
                        <BiChevronDown />
                    </StyledDownArrowWrapper>
                </StyledPlaceholder>
            </StyledPlaceHolderWrapper>
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
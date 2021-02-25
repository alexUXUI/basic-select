import { FC, SyntheticEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { BiChevronDown } from "react-icons/bi";
import { StyledBasicSelect, StyledPlaceholder, StyledDownArrowWrapper } from './Basic-Select.styled'

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

//WHAT DO WE NEED
// 1. wrapper/root node X
// 2. open/close state X
// 3. selected state and what it is X
// 4. placeholder
// 5. dropdown menu of sorts X
// 6. list items (options) X
// 7. aria accessibility
// 8. keyboard navigation
// 9. STYLES omg
// 10. tests
// 11. abstractions (if needed. perhaps not this run)

const StyledPlaceHolderWrapper = styled.span`
    border: 1px solid #eaeaea;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
`

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

    useLayoutEffect(() => {
        document.addEventListener('click', handleDocumentClicks, false);
        document.addEventListener('keydown', handleDocumentKeydowns, false);

        return () => {
            document.removeEventListener('click', handleDocumentClicks, false);
            document.removeEventListener('keydown', handleDocumentKeydowns, false);
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            const listHasItem = focusedListItemRef && focusedListItemRef.current;

            if (listHasItem) {
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

    const handleDocumentKeydowns = (e: any) => {

        let DOMNodeWithFocus = document.activeElement;

        let userTabbedOutside = !basicSelectRef?.current?.contains(DOMNodeWithFocus)

        if (userTabbedOutside) {
            setIsOpen(false)
        }

        if (isOpen) {
            if (e.key === "ArrowDown") {
                if (e && e.target && e.target.nextSibling) {
                    e.target.nextSibling.focus();
                }
            }

            else if (e.key === "ArrowUp") {
                if (e && e.target && e.target.previousSibling) {
                    e.target.previousSibling.focus()
                }
            }
        }
    }

    const handleKeyDown = ({ key: pressedKey }: { key: string }): void => {
        console.log(pressedKey)
        if (keysThatToggleMenu.includes(pressedKey)) {
            setIsOpen(!isOpen)
        }
    }

    const setSelectedAndClose = (option: Option) => {
        setSelectedOption(option)
        onChange && onChange(option)
        setIsOpen(false)
    }

    return (
        <StyledBasicSelect
            ref={basicSelectRef}
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
                e.preventDefault();
                onBlur && onBlur();
            }}
        >
            <StyledPlaceHolderWrapper>
                <StyledPlaceholder>
                    {selectedOption != undefined ? selectedOption.display : placeholder}
                    <StyledDownArrowWrapper>
                        <BiChevronDown />
                    </StyledDownArrowWrapper>
                </StyledPlaceholder>
            </StyledPlaceHolderWrapper>
            {
                isOpen
                    ? (
                        <ul data-testid="basic-select__menu">
                            {
                                options && options.length
                                    ? options.map((option, i) => {
                                        let listItemHasFocus = Boolean(selectedOption && selectedOption.value === option.value || i === 0)

                                        return (
                                            <li
                                                tabIndex={0}
                                                ref={listItemHasFocus ? focusedListItemRef : null}
                                                key={i}
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
                                            </li>
                                        )
                                    })
                                    : null
                            }
                        </ul>
                    )
                    : null
            }
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

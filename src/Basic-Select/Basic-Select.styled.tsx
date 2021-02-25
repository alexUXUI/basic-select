import styled, { css, keyframes } from "styled-components";

export const StyledBasicSelect = styled.div.attrs((props) => ({
    'data-testid': "basic-select",
    tabIndex: 0,
    role: 'select'
}))`
    height: fit-content;
`

export const StyledPlaceholder = styled.span.attrs((props) => ({
    'data-testid': "basic-select__placeholder"
}))`
    border: none;

    :focus {
        outline: none
    }
`

export const StyledDownArrowWrapper = styled.span.attrs((props) => ({
    'data-testid': "drop-down-arrow"
}))`
    display: inline-block;
    min-width: 50px;
    text-align: right;
`

export const StyledPlaceHolderWrapper = styled.span`
    border: 10px solid pink;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
`

export const StyledMenu = styled.ul`
    list-style: none;
    padding: 0;
    border: 1px solid #eaeaea;
    background: cornflowerblue;
    border-radius: 14px;
`

export const StyledMenuItem = styled.li`
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
`

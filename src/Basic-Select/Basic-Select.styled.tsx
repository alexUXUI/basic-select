import styled, { css, keyframes } from "styled-components";

export const StyledBasicSelect = styled.div.attrs((props) => ({
    'data-testid': "basic-select",
    tabIndex: 0,
    role: 'select'
}))`
    
    /* background: white; */
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
import styled from 'styled-components';

import { bgcolorBorder, bgColorInput } from '../constants/colors';

const Input = styled.input`
    width: 100%;
    height: 1.2em;
    padding: 0.1em;
    border: 1px solid ${bgcolorBorder};
    backgound: ${bgColorInput}};
`

export default Input;
/* eslint-disable react/display-name */
import React from 'react';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

jest.mock('@/components/organisms/Header', () => () => <div data-testid="header">Mock Header</div>);

jest.mock('@/components/templates/List', () => () => <div data-testid="list">Mock List</div>)


describe('Home Page', () => {

  it('Header and List sholud be rendered', () => {
    render(<Home/>)
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('list')).toBeInTheDocument()
  })

})
// @flow

import * as React from 'react'

export const SearchInput = ({
  onChange,
  placeholder,
}: {
  onChange: (text: string) => void,
  placeholder?: string,
}) => (
  <form
    className="search-form"
    style={{
      padding: '0',
    }}
  >
    <ul>
      <li>
        <input
          type="search"
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
        <button>
          <i class="icon icon-zoom" />
        </button>
      </li>
    </ul>
  </form>
)

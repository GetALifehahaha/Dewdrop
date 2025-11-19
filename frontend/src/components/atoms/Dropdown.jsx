import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Dropdown = ({value, selectName, selectItems, onSelect}) => {

    const listItems = Object.entries(selectItems).map(([key, value], index) => <SelectItem className='cursor-pointer hover:bg-main-hover font-medium' key={index} value={value}>{key}</SelectItem>)

  return (
    <Select onValueChange={(val) => onSelect(val)}>
      <SelectTrigger className="w-[180px] bg-main border-main-dark ring-main-gray font-medium text-text cursor-pointer py-5 shadow-sm">
        <SelectValue placeholder={value || selectName} />
      </SelectTrigger>
      <SelectContent className='bg-main border-main-dark'>
        <SelectGroup>
            {listItems}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default Dropdown

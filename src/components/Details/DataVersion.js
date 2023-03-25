import React from 'react'

const DataVersion = ({version}) => {
  return (
      <p className="version mt-6 text-lg text-white">
          <span className="font-semibold">Released:</span> Version {version}
      </p>
  )
}

export default DataVersion
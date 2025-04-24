//import Image from "next/image"

export function EquityLogo({
  className = "",
  width = 120,
  height = 40,
}: { className?: string; width?: number; height?: number }) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <img
        src="https://www.equitylogistics.com.au/wp-content/uploads/2016/02/EquityLogo.png"
        alt="Equity Logistics Logo"
        width={width}
        height={height}
        className="object-contain"
      />
    </div>
  )
}


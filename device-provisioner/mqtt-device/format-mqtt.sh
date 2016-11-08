# strip space
gawk `
  BEGIN {FS = OFS = "\""}
  /^[[:blank:]]*$/ {next}
  {for (i=1; i<=NF; i+=2) gsub(/[[:space:]]/,"",$i)}
  1
`

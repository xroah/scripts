type StringPair = [string, string]

export const entry = <StringPair>[
    "-e, --entry <entry>",
    "Entry file, default src/index.[jt]sx"
]
export const config = <StringPair>[
    "-c, --config <file>",
    "Configuration file"
]
export const index = <StringPair>[
    "--index <index>",
    "index.html file, default public/index.html"
]
export const noTs = <StringPair>[
    "--no-ts", 
    "Use javascript"
]
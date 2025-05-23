import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e6f7ff",
      100: "#b3e0ff",
      200: "#80caff",
      300: "#4db3ff",
      400: "#1a9dff",
      500: "#0080ff",
      600: "#0066cc",
      700: "#004d99",
      800: "#003366",
      900: "#001a33",
    },
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
      },
    },
    Card: {
      baseStyle: {
        p: "4",
        borderRadius: "lg",
        boxShadow: "md",
      },
    },
  },
})

export default theme

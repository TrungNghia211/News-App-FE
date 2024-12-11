import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = (title, status) => {
    toast({
      title,
      status,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return {
    showToast,
    success: (title) => showToast(title, "success"),
    error: (title) => showToast(title, "error"),
  };
};

export default useCustomToast;

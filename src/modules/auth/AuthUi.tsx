import {
  AuthHeadingHelperCombo,
  IAuthHeadingHelperComboProps,
} from "./AuthHeadingHelperCombo";
import NextLink from "next/link";
import { Seo } from "~/lib/seo/Seo";
import { AuthFooter } from "./AuthFooter";
import { DeepRequired } from "utility-types";
import { ReactNode, useEffect } from "react";
import { useToast } from "~/lib/ui/useToast";
import { AuthImageHolder } from "./AuthImageHolder";
import { WEBSITE_TITLE } from "~/lib/seo/constants";
import { AuthAction, IAuthActionProps } from "./AuthAction";
import { Box, chakra, Divider, Flex, Spacer, Stack } from "@chakra-ui/react";

type IAuthUiProps = {
  seo: {
    prefix: string;
  };

  actions?: {
    primary?: IAuthActionProps;
    secondary?: IAuthActionProps;
  };

  children: ReactNode;
  heading: IAuthHeadingHelperComboProps;
};

type IAuthUiPropsStrict = DeepRequired<IAuthUiProps>;

// This function will apply default values to the fields that
// are optional.
const withApplyDefaultProps = (props: IAuthUiProps): IAuthUiPropsStrict => ({
  actions: {
    primary: props.actions?.primary ?? {
      href: "/",
      text: "← Back to the main page",
    },

    secondary: props.actions?.secondary ?? {
      text: "Forgot password?",
      href: "/auth/forgot-password",
    },
  },

  heading: {
    helper: props.heading.helper ?? (
      <>
        Already using Polygon?{" "}
        <NextLink passHref href={"/auth/login"}>
          <chakra.a
            _hover={{
              color: "purple.200",
            }}
            color={"purple.300"}
          >
            Log in
          </chakra.a>
        </NextLink>{" "}
        to your account!
      </>
    ),
    children: props.heading.children!,
  },

  seo: props.seo,
  children: props.children!,
});

export const AuthUi = (props: IAuthUiProps) => {
  props = withApplyDefaultProps(props) as IAuthUiPropsStrict;
  const toast = useToast();

  useEffect(() => {
    const currentUrl = new URL(window.location.href);

    if (
      currentUrl.searchParams.get("auth-required") !== null &&
      currentUrl.searchParams.get("is-redirected") !== null
    ) {
      toast({
        status: "error",
        title: "Authentication required",
        description: "Please login or create an account before continuing",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Seo title={props.seo.prefix + " - " + WEBSITE_TITLE} />

      <Flex h={"100vh"} alignItems={"center"}>
        <AuthImageHolder />

        <Flex
          w={"full"}
          px={[4, 12]}
          flexGrow={[0.5, 1]}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Stack maxW={"xl"} w={"full"} spacing={6}>
            <Stack spacing={6}>
              <AuthHeadingHelperCombo helper={props.heading.helper}>
                {props.heading.children}
              </AuthHeadingHelperCombo>

              <Box>{props.children}</Box>

              <Flex alignItems={"center"}>
                <AuthAction
                  href={props.actions?.primary?.href!}
                  text={props.actions?.primary?.text!}
                />

                <Spacer />

                <AuthAction
                  href={props.actions?.secondary?.href!}
                  text={props.actions?.secondary?.text!}
                />
              </Flex>
            </Stack>

            <Stack spacing={1}>
              <Divider />
              <AuthFooter />
            </Stack>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
};

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

import AddNewGroup from "components/AddNewGroup";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import invariant from "tiny-invariant";

const headers = ["Id", "Title", "Description", "Actions"];

type IntentType = "add" | "delete" | "update";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { session } = await authenticate.admin(request);

    const body = await request.formData();
    const name = body.get("name") as string;
    const description = body.get("description") as string;
    const intent = body.get("intent") as IntentType;
    const shop = session.shop;

    invariant(shop, "You are unauthorized to do this action");
    invariant(name, "Name cannot be empty");
    invariant(description, "Description cannot be empty");

    if (intent === "add") {
      await prisma.group.create({
        data: {
          description: description,
          name: name,
          shop: shop,
        },
      });

      return json({ success: true });
    }
  } catch (error) {
    return json({
      success: false,
    });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  invariant(shop, "You are unauthorized to do this action");

  const groups = await prisma.group.findMany({
    where: {
      shop,
    },
  });

  return json({ data: groups });
}

const Groups = () => {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const { data } = useLoaderData<typeof loader>();

  const isSubmitting = navigation.state === "submitting";
  const isSubmitted = Boolean(actionData?.success);

  return (
    <Table>
      <TableCaption>
        <AddNewGroup isSubmitted={isSubmitted} isSubmitting={isSubmitting} />
      </TableCaption>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead
              className={index === header.length - 1 ? "text-right" : ""}
              key={index}
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(({ id, name, description }) => (
          <TableRow key={id}>
            <TableCell>{id}</TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{description}</TableCell>
            <TableCell className="flex space-x-4 text-right">
              <Link to={`/app/groups/${id}`} className="">
                Edit
              </Link>
              <Link to="/" className="">
                FAQs
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Groups;

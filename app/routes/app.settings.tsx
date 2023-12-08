import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import invariant from "tiny-invariant";
import { authenticate } from "~/shopify.server";

export async function action({ request }: ActionFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);
  const metaField = new admin.rest.resources.Metafield({
    session,
  });
  const body = await request.formData();

  const generalFormData = body.get("general")?.toString() ?? "0";
  const productFormData = body.get("product")?.toString() ?? "0";

  const general = Boolean(parseInt(generalFormData));
  const product = Boolean(parseInt(productFormData));

  metaField.general = general;
  metaField.product = product;
  metaField.namespace = "test";
  metaField.key = "settings";
  metaField.type = "json";
  metaField.value = JSON.stringify({
    general,
    product,
  });

  await metaField.save({
    update: true,
  });

  invariant(
    metaField?.owner_id,
    "Something went wrong while saving meta field"
  );

  await prisma.settings.upsert({
    where: {
      ownerId: String(metaField?.owner_id),
    },
    create: {
      ownerId: String(metaField?.owner_id),
      general: Boolean(general),
      product: Boolean(product),
    },
    update: {
      general: Boolean(general),
      product: Boolean(product),
    },
  });

  return json({ success: true, general, product });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);
  const metaField = new admin.rest.resources.Metafield({
    session,
  });

  // invariant(metaField?.owner_id, "Error");

  // const settings = await prisma.settings.findMany({
  //   where: {
  //     ownerId: String(metaField?.owner_id),
  //   },
  // });

  return json({
    // settings,
    metaField,
  });
}

const SettingsPage = () => {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  console.log("actionData ", actionData);
  console.log("loaderData ", loaderData);

  return (
    <Form className="p-6 md:p-10 space-y-4" method="POST">
      <div className="space-y-3">
        <Label>General FAQ</Label>
        <div className="flex space-x-4 items-center">
          <Input
            type="radio"
            name="general"
            id="general_enable"
            className="w-4 h-4"
            value="0"
          />
          <Label htmlFor="general_enable">Enable</Label>
        </div>
        <div className="flex space-x-4 items-center">
          <Input
            type="radio"
            name="general"
            id="general_disable"
            className="w-4 h-4"
            value="0"
          />
          <Label htmlFor="general_disable">Disable</Label>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Product FAQ</Label>
        <div className="flex space-x-4 items-center">
          <Input
            type="radio"
            name="product"
            id="product_enable"
            className="w-4 h-4"
            value="1"
          />
          <Label htmlFor="product_enable">Enable</Label>
        </div>
        <div className="flex space-x-4 items-center">
          <Input
            type="radio"
            name="product"
            id="product_disable"
            className="w-4 h-4"
            value="0"
          />
          <Label htmlFor="product_disable">Disable</Label>
        </div>
      </div>

      <Button type="submit" size="sm">
        Save changes
      </Button>
    </Form>
  );
};

export default SettingsPage;

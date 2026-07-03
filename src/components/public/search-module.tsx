import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";

export function SearchModule() {
  return (
    <section id="search" className="relative z-10 -mt-12 px-5 sm:px-8 lg:px-10">
      <Card
        variant="glass"
        className="mx-auto max-w-6xl p-5 sm:p-6 lg:p-7"
        aria-label="Property search"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <InputField
            label="Location or keyword"
            name="location"
            placeholder="Waterfront, penthouse, private estate"
            type="search"
          />
          <SegmentedControl
            label="Search profile"
            name="search_profile"
            options={[
              { label: "Villa", value: "villa" },
              { label: "Estate", value: "estate" },
              { label: "Penthouse", value: "penthouse" },
              { label: "$6M+", value: "6m-plus" },
            ]}
          />
          <Button className="h-12 px-8" type="button">
            Search
          </Button>
        </div>
      </Card>
    </section>
  );
}

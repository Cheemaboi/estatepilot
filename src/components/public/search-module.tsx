import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField } from "@/components/ui/field";

export function SearchModule() {
  return (
    <section id="search" className="relative z-10 -mt-12 px-5 sm:px-8 lg:px-10">
      <Card
        variant="glass"
        className="mx-auto max-w-6xl p-5 sm:p-6 lg:p-7"
        aria-label="Property search"
      >
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr_0.85fr_auto] lg:items-end">
          <InputField
            label="Location or keyword"
            name="location"
            placeholder="Waterfront, penthouse, private estate"
            type="search"
          />
          <SelectField label="Property type" name="type" defaultValue="villa">
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
            <option value="estate">Estate</option>
            <option value="townhome">Townhome</option>
          </SelectField>
          <SelectField label="Budget" name="budget" defaultValue="2m-6m">
            <option value="1m-2m">$1M - $2M</option>
            <option value="2m-6m">$2M - $6M</option>
            <option value="6m-plus">$6M+</option>
          </SelectField>
          <Button className="h-12 px-8" type="button">
            Search
          </Button>
        </div>
      </Card>
    </section>
  );
}

import ifcopenshell
from ifctester import ids, reporter


# create new IDS
my_ids = ids.Ids(title="My IDS")

# add specification to it
my_spec = ids.Specification(name="My first specification")
my_spec.applicability.append(ids.Entity(name="IFCWALL"))
property = ids.Property(
    baseName="IsExternal",
    value="TRUE", 
    propertySet="Pset_WallCommon", 
    dataType="IfcBoolean",
    uri="https://identifier.buildingsmart.org/uri/.../prop/LoadBearing", 
    instructions="Walls need to be load bearing.",
    cardinality="required")
my_spec.requirements.append(property)
my_ids.specifications.append(my_spec)

# Save such IDS to file
result = my_ids.to_xml("SampleIDS.xml")

# open  IFC file:
my_ifc = ifcopenshell.open("MyIfcModel.ifc")

# validate IFC model against IDS requirements:
my_ids.validate(my_ifc)

# show results:
reporter.Console(my_ids).report()